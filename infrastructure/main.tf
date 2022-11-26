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
  env       = var.env
}

variable "image_tag" {}
variable "env" {}