# CloudWatch Log Groups with 30-day retention
resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/ecs/${var.project_name}-api"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "matching_logs" {
  name              = "/ecs/${var.project_name}-matching"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "voice_logs" {
  name              = "/ecs/${var.project_name}-voice"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "admin_logs" {
  name              = "/ecs/${var.project_name}-admin"
  retention_in_days = 30
}

# SNS Topic for Alarms
resource "aws_sns_topic" "ops_alerts" {
  name = "${var.project_name}-ops-alerts"
}

# Metric Alarm: High API 5XX Error Rate
resource "aws_cloudwatch_metric_alarm" "api_5xx_errors" {
  alarm_name          = "${var.project_name}-high-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "API returning 5XX responses exceeding SLA threshold"
  alarm_actions       = [aws_sns_topic.ops_alerts.arn]

  dimensions = {
    TargetGroup  = aws_lb_target_group.api.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# Metric Alarm: High API Latency (p95 > 500ms)
resource "aws_cloudwatch_metric_alarm" "api_high_latency" {
  alarm_name          = "${var.project_name}-high-target-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  extended_statistic  = "p95"
  threshold           = 0.5
  alarm_description   = "API target p95 response time exceeds 500ms"
  alarm_actions       = [aws_sns_topic.ops_alerts.arn]

  dimensions = {
    TargetGroup  = aws_lb_target_group.api.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# Metric Alarm: RDS High CPU Utilization
resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${var.project_name}-rds-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "PostgreSQL PostGIS RDS CPU utilization exceeds 80%"
  alarm_actions       = [aws_sns_topic.ops_alerts.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.identifier
  }
}
