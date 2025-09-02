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

resource "google_storage_bucket" "tfstate" {
  name                        = "${local.prefix}tfstate-${random_string.suffix.result}"
  location                    = "US"
  storage_class               = "STANDARD"
  public_access_prevention    = "enforced"
  force_destroy               = var.environment == "prod" ? false : true
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "course_catalog" {
  name                        = "${local.prefix}course-catalog-${random_string.suffix.result}"
  location                    = "US"
  storage_class               = "STANDARD"
  public_access_prevention    = "enforced"
  force_destroy               = var.environment == "prod" ? false : true
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
  autoclass {
    enabled = true
  }
}

resource "google_storage_bucket" "cloud_run_code" {
  name                        = "${local.prefix}ccwis-case-management-cr-code-${random_string.suffix.result}"
  location                    = "US"
  storage_class               = "STANDARD"
  public_access_prevention    = "enforced"
  force_destroy               = var.environment == "prod" ? false : true
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
  autoclass {
    enabled = true
  }
}

resource "google_storage_bucket" "firebase_storage" {
  name                        = "${local.prefix}firebase-storage-${random_string.suffix.result}"
  location                    = "US"
  storage_class               = "STANDARD"
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true
  force_destroy               = var.environment == "prod" ? false : true
  versioning {
    enabled = true
  }
  autoclass {
    enabled = true
  }
}
