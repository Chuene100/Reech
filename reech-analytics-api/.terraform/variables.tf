variable "database_link" {
  description = "MongoDB database link"
}

variable "image" {
  type = string
}
variable "image_tag" {
  type = string
}

variable "project" {
  description = "Google Cloud project ID"
}

variable "region" {
  description = "Google Cloud region"
  default     = "us-east1"
}

variable "service_name" {
  description = "Google Cloud Run service name"
}
