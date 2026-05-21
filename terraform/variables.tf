variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "digitrans-cm"
}

variable "environment" {
  description = "Environnement : dev, staging ou prod"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "L'environnement doit etre dev, staging ou prod."
  }
}

variable "aws_region" {
  description = "Region AWS — Afrique du Sud (Le Cap)"
  type        = string
  default     = "af-south-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnets" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnets" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_password" {
  description = "Mot de passe PostgreSQL"
  type        = string
  sensitive   = true
}

variable "certificate_arn" {
  description = "ARN du certificat SSL pour le Load Balancer"
  type        = string
  default     = ""
}
