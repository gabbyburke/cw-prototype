resource "google_monitoring_notification_channel" "emails" {
  for_each     = toset(var.alert_email_address_list)
  display_name = each.key
  type         = "email"
  labels = {
    email_address = each.key
  }
  force_delete = true
}

resource "google_monitoring_alert_policy" "http_errors" {
  display_name          = "Frontend HTTP Errors"
  combiner              = "OR"
  enabled               = true
  notification_channels = [for each in google_monitoring_notification_channel.emails : each.id]
  severity              = "ERROR"
  alert_strategy {
    auto_close = "604800s"
    notification_prompts = [
      "OPENED",
    ]
    notification_rate_limit {
      period = "1800s"
    }
  }

  conditions {
    display_name = "Log match condition"
    condition_matched_log {
      filter = <<-EOT
                resource.type = "cloud_run_revision"
                resource.labels.service_name = "${google_cloud_run_v2_service.ui.name}"
                httpRequest.status >= 400
            EOT
      label_extractors = {
        "http_response"  = "EXTRACT(httpRequest.status)"
        "request_method" = "EXTRACT(httpRequest.requestMethod)"
        "service_name"   = "EXTRACT(resource.labels.service_name)"
      }
    }
  }

  documentation {
    content   = <<-EOT
            ### HTTP Error
            An HTTP error has occurred on a Cloud Run service.

            - **Timestamp**: $${log.timestamp}
            - **Service**: $${log.extracted_label.service_name}
            - **Status Code**: $${log.extracted_label.http_response}
            - **Request Method**: $${log.extracted_label.request_method}
            - **Log Payload**: $${log.text_payload}
            
            [Click here to view the log entry](https://console.cloud.google.com/logs/viewer?project=$${project}&advancedFilter=insertId%3D%22$${log.insertId}%22)
        EOT
    mime_type = "text/markdown"
  }
}
