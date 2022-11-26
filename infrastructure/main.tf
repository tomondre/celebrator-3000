terraform {
  cloud {
    organization = "raspberry-kubernetes-cluster"

    workspaces {
      tags = ["tomondre-celebrator-3000"]
    }
  }
}

module "celebrator-3000" {
  source    = "git::https://github.com/tomondre/raspberry-kubernetes-cluster.git//terraform-modules/reusable-modules/cron-job"
  cron      = "0 6 * * *"
  image_url = "docker.io/tomondre/celebrator-3000"
  name      = "celebrator-3000"
  image_tag = var.image_tag
  env       = {
    BASIN_HOST = var.basin_host
    DATABASE_URL= var.database_url
    RABBITMQ_USERNAME = var.rabbitmq_username
    RABBITMQ_PASSWORD = var.rabbitmq_password
    RABBITMQ_HOST = var.rabbitmq_host
    RABBITMQ_PORT = var.rabbitmq_port
    EMAILS = var.emails
  }
}

variable "basin_host" {}
variable "database_url" {}
variable "rabbitmq_username" {}
variable "rabbitmq_password" {}
variable "rabbitmq_host" {}
variable "rabbitmq_port" {}
variable "emails" {}
variable "image_tag" {}
