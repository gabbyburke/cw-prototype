# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

locals {
  schema_dir   = "${path.module}/../src/scripts/bq_schemas"
  schema_files = fileset(local.schema_dir, "*.json")
  table_schemas = {
    for file_name in local.schema_files :
    trimsuffix(file_name, ".json") => jsondecode(file("${local.schema_dir}/${file_name}")).schema
  }

  datasets = {
    cw_case_notes = {
      tables = {
        for table_name, schema in local.table_schemas :
        table_name => {
          schema = schema
        }
      }
      views    = {}
      routines = {}
    }
  }
  dataset_ids = [for dataset_name, tables in module.bigquery : dataset_name]
}

module "bigquery" {
  for_each   = local.datasets
  source     = "terraform-google-modules/bigquery/google"
  version    = "10.1.1"
  dataset_id = var.add_random_suffix ? "${each.key}_${random_string.suffix.result}" : each.key
  project_id = data.google_project.current.project_id

  tables = [
    for table_name, table_config in each.value.tables : {
      table_id = table_name
      schema   = jsonencode(table_config.schema)
    }
  ]
}

# Table definition
# list(object({ 
#     table_id = string, 
#     description = optional(string), 
#     table_name = optional(string), = string, 
#     schema = string,
#     clustering = optional(list(string), []), 
#     require_partition_filter = optional(bool), 
#     time_partitioning = optional(object({ 
#         expiration_ms = string, 
#         field = string, 
#         type = string, }), null), 
#     range_partitioning = optional(object({ 
#         field = string, 
#         range = object({ 
#             start = string, 
#             end = string, 
#             interval = string, }), }), null), 
#     expiration_time = optional(string, null), 
#     deletion_protection = optional(bool), 
#     labels = optional(map(string), {}), 
# }))

resource "google_bigquery_connection" "this" {
  connection_id = "models"
  project       = data.google_project.current.project_id
  location      = module.bigquery["cw_case_notes"].bigquery_dataset.location
  cloud_resource {}
}

resource "google_project_iam_member" "vertex_ai_user" {
  for_each = toset([
    "roles/aiplatform.user",
  ])
  project = data.google_project.current.project_id
  role    = each.value
  member  = "serviceAccount:${google_bigquery_connection.this.cloud_resource[0].service_account_id}"
}

resource "google_bigquery_job" "create_embedding_model" {
  job_id = "create_embedding_model"
  query {
    query = <<-EOT
      CREATE OR REPLACE MODEL `${module.bigquery["cw_case_notes"].bigquery_dataset.project}.${module.bigquery["cw_case_notes"].bigquery_dataset.dataset_id}.gemini-embedding-001`
      REMOTE WITH CONNECTION `${module.bigquery["cw_case_notes"].bigquery_dataset.project}.${google_bigquery_connection.this.location}.${google_bigquery_connection.this.connection_id}`
      OPTIONS (ENDPOINT = 'gemini-embedding-001');
    EOT

    default_dataset {
      dataset_id = module.bigquery["cw_case_notes"].bigquery_dataset.dataset_id
      project_id = module.bigquery["cw_case_notes"].bigquery_dataset.project
    }

    create_disposition = ""
    write_disposition  = ""
  }

  depends_on = [
    time_sleep.wait_for_iam_propagation
  ]
}