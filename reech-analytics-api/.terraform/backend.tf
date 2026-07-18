terraform {
  backend "gcs" {
    bucket = "reech-tfstate-storage-bucket"
    prefix = "analytics_api"
  }
}
