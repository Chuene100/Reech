terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "3.70.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

# ====================================================
# Enable Google APIs
resource "google_project_service" "reech_iam_api" {
  service            = "iam.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "reech_analytics_run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "analytics_resource_manager" {
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "reech_analytics_container_registry" {
  service            = "containerregistry.googleapis.com"
  disable_on_destroy = true
}

# ====================================================
resource "google_cloud_run_service" "cloud_run_service_c" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = var.image
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Wait for the APIs to be enabled
  depends_on = [
    google_project_service.reech_analytics_run_api,
    google_project_service.analytics_resource_manager,
    google_service_account.cloud_run_deployer_ac
  ]

}

# ====================================================
# Create a Service Account for deployment
resource "google_service_account" "cloud_run_deployer_ac" {
  project      = var.project
  account_id   = "reech-node-api-deployer-id003"
  display_name = "Deployment Service Account"
}

resource "google_service_account_key" "cloud_run_deployer_ac_key" {
  service_account_id = google_service_account.cloud_run_deployer_ac.name
}

resource "google_project_iam_member" "project_editor_iam_policy_002" {
  project = var.project
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.cloud_run_deployer_ac.email}"
}

resource "google_cloud_run_service_iam_member" "cloud_run_svc_invoker_policy_2" {
  project  = var.project
  service  = google_cloud_run_service.cloud_run_service_c.name
  location = google_cloud_run_service.cloud_run_service_c.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}


# ====================================================
# Outputs

output "url" {
  value = google_cloud_run_service.cloud_run_service_c.status[0].url
}

output "cloud_run_deployer_ac_key" {
  sensitive = true
  value     = base64decode(google_service_account_key.cloud_run_deployer_ac_key.private_key)
}
