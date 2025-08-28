# Terraform Network Module
This opinionated module makes it easier to set up a new VPC network in GCP by defining your network and subnet ranges in a single module definition. 

It supports creating:
- A Google Virtual Private Network (VPC)
- Subnets within the VPC
- Secondary ranges for the subnets
- A NAT router (optional)
- Private Service Connection (optional)

This module will also:
- Disable default VPC firewall rules (optional, defaults to true)
- Enable project auditing (optional, defaults to true)

## Prerequisites
- An existing project is required, and assumed based on provider configuration.

## Usage
`main.tf` example:

```hcl
module "network" {
  source = "./modules/network"
  prefix = local.prefix
  enable_cloud_nat               = true
  disable_default_firewall_rules = false
  enable_all_services_audit_logs = true
  force_destroy_logs_buckets     = var.environment == "prod" ? false : true
  log_retention_seconds          = 31536000 # 1 year
  logs_storage_class             = var.environment == "prod" ? "ARCHIVE" : "STANDARD"
}
```

## Terraform Docs
<!-- BEGIN_TF_DOCS -->

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | >= 5.38.0 |
| <a name="provider_random"></a> [random](#provider\_random) | >= 3.6.3 |
| <a name="provider_time"></a> [time](#provider\_time) | >= 0.12.0 |
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5.7 |
| <a name="requirement_google"></a> [google](#requirement\_google) | >= 5.38.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | >= 3.6.3 |
| <a name="requirement_time"></a> [time](#requirement\_time) | >= 0.12.0 |
## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_disable_default_firewall_rules"></a> [disable\_default\_firewall\_rules](#input\_disable\_default\_firewall\_rules) | Disable default firewall rules in default network | `bool` | `true` | no |
| <a name="input_enable_all_services_audit_logs"></a> [enable\_all\_services\_audit\_logs](#input\_enable\_all\_services\_audit\_logs) | Enable all services audit logs | `bool` | `true` | no |
| <a name="input_enable_cloud_nat"></a> [enable\_cloud\_nat](#input\_enable\_cloud\_nat) | Set to true if you need to enable Cloud NAT for internet connectivity | `bool` | `false` | no |
| <a name="input_force_destroy_logs_buckets"></a> [force\_destroy\_logs\_buckets](#input\_force\_destroy\_logs\_buckets) | Force destroy logs archive and bucket access logs buckets | `bool` | `false` | no |
| <a name="input_labels"></a> [labels](#input\_labels) | A map of labels to apply to contained resources | `map(any)` | `{}` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | Number of days to retain logs in project logging bucket | `number` | `365` | no |
| <a name="input_log_retention_policy_locked"></a> [log\_retention\_policy\_locked](#input\_log\_retention\_policy\_locked) | Whether or not the log retention policy is locked | `bool` | `false` | no |
| <a name="input_log_retention_seconds"></a> [log\_retention\_seconds](#input\_log\_retention\_seconds) | Number of seconds to retain logs in audit logs archive bucket | `number` | `220752000` | no |
| <a name="input_logs_storage_class"></a> [logs\_storage\_class](#input\_logs\_storage\_class) | Storage class for logs archive and bucket access logs buckets | `string` | `"ARCHIVE"` | no |
| <a name="input_network_name"></a> [network\_name](#input\_network\_name) | Name of the network | `string` | `null` | no |
| <a name="input_prefix"></a> [prefix](#input\_prefix) | Prefix to be used in naming all applicable resources | `string` | `""` | no |
| <a name="input_secondary_subnets"></a> [secondary\_subnets](#input\_secondary\_subnets) | List of secondary subnets to create in the VPC | `map(string)` | `{}` | no |
| <a name="input_subnetwork_cidr"></a> [subnetwork\_cidr](#input\_subnetwork\_cidr) | CIDR block for the VPC subnetwork | `string` | `null` | no |
| <a name="input_suffix"></a> [suffix](#input\_suffix) | Suffix to be used in naming all applicable resources | `string` | `""` | no |
## Outputs

| Name | Description |
|------|-------------|
| <a name="output_dns_policy"></a> [dns\_policy](#output\_dns\_policy) | DNS Policy |
| <a name="output_logs_bucket"></a> [logs\_bucket](#output\_logs\_bucket) | Logs bucket |
| <a name="output_network"></a> [network](#output\_network) | VPC network |
| <a name="output_router"></a> [router](#output\_router) | GCP Cloud Router |
| <a name="output_router_nat"></a> [router\_nat](#output\_router\_nat) | GCP Cloud NAT |
| <a name="output_subnetwork"></a> [subnetwork](#output\_subnetwork) | Subnetwork and secondary subnets |
## Resources

| Name | Type |
|------|------|
| [google_compute_address.nat](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_address) | resource |
| [google_compute_network.this](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_network) | resource |
| [google_compute_router.router](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_router) | resource |
| [google_compute_router_nat.nat](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_router_nat) | resource |
| [google_compute_subnetwork.subnets](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_subnetwork) | resource |
| [google_dns_policy.this](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_policy) | resource |
| [google_logging_project_bucket_config.default](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/logging_project_bucket_config) | resource |
| [google_logging_project_bucket_config.gcs](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/logging_project_bucket_config) | resource |
| [google_logging_project_sink.all_logs](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/logging_project_sink) | resource |
| [google_project_iam_audit_config.all_services](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_iam_audit_config) | resource |
| [google_project_iam_binding.all_logs_writer](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/project_iam_binding) | resource |
| [google_storage_bucket.logs](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket) | resource |
| [google_storage_bucket.logs_archive](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket) | resource |
| [google_storage_bucket_iam_binding.logs](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket_iam_binding) | resource |
| [random_string.random](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string) | resource |
| [time_sleep.wait_x_seconds](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/sleep) | resource |
| [google_client_config.current](https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/client_config) | data source |
| [google_project.current](https://registry.terraform.io/providers/hashicorp/google/latest/docs/data-sources/project) | data source |
## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_default_firewall"></a> [default\_firewall](#module\_default\_firewall) | terraform-google-modules/gcloud/google | ~> 3.4 |
<!-- END_TF_DOCS -->