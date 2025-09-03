terraform {
  backend "gcs" {
    bucket = "tf-state-rit-ccwis-smo-dev" # Replace with your GCS bucket name
    prefix = "terraform/state"
  }
}
