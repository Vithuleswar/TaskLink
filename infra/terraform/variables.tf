variable "aws_region" {
  description = "AWS region for India data residency (DPDP Act 2023 compliance)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (staging or production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "tasklink"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "db_name" {
  description = "PostgreSQL Database name"
  type        = string
  default     = "tasklink_db"
}

variable "db_username" {
  description = "PostgreSQL Master Username"
  type        = string
  default     = "tasklink_admin"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t4g.medium"
}

variable "api_desired_count" {
  description = "Desired count of API ECS tasks"
  type        = number
  default     = 2
}

variable "matching_desired_count" {
  description = "Desired count of Python Matching ECS tasks"
  type        = number
  default     = 2
}

variable "voice_desired_count" {
  description = "Desired count of Voice Gateway ECS tasks"
  type        = number
  default     = 2
}

variable "domain_name" {
  description = "Primary domain for TaskLink platform"
  type        = string
  default     = "tasklink.coop.in"
}
