# ============================================================
# MODULE CLOUDWATCH — Supervision DIGITRANS-CM
# Surveille RDS, Redis, ALB et déclenche des alertes
# ============================================================

# ── Groupe de logs pour l'API ────────────────────────────────
resource "aws_cloudwatch_log_group" "api" {
  name              = "/digitrans-cm/${var.environment}/api"
  retention_in_days = 30
  tags = { Name = "${var.project_name}-${var.environment}-logs" }
}

# ── Alarme CPU RDS élevé ─────────────────────────────────────
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-cpu"
  alarm_description   = "CPU RDS PostgreSQL dépasse 80%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    DBInstanceIdentifier = var.rds_id
  }

  tags = { Name = "${var.project_name}-${var.environment}-alarm-rds-cpu" }
}

# ── Alarme connexions RDS élevées ────────────────────────────
resource "aws_cloudwatch_metric_alarm" "rds_connections" {
  alarm_name          = "${var.project_name}-${var.environment}-rds-connections"
  alarm_description   = "Trop de connexions simultanées à PostgreSQL"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 60
  statistic           = "Average"
  threshold           = 100

  dimensions = {
    DBInstanceIdentifier = var.rds_id
  }

  tags = { Name = "${var.project_name}-${var.environment}-alarm-rds-conn" }
}

# ── Dashboard CloudWatch ─────────────────────────────────────
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          title  = "CPU RDS PostgreSQL"
          period = 300
          metrics = [["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", var.rds_id]]
        }
      },
      {
        type = "log"
        properties = {
          title   = "Logs API DIGITRANS-CM"
          query   = "SOURCE '/digitrans-cm/${var.environment}/api' | fields @timestamp, @message | sort @timestamp desc | limit 50"
          region  = "af-south-1"
        }
      }
    ]
  })
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.api.name
}
