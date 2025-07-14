# Placeholder content - `setup.sh`/ps1 will overwrite this
terraform {
  backend "gcs" {
    bucket  = "UPDATE_ME_BY_SETUP_SCRIPT" # This will be replaced
    prefix  = "envs/dev"
  }
}
