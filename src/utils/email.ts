import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

config()

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
})

interface SendEmailCommandParams {
  fromAddress?: string
  toAddresses: string[]
  ccAddresses?: string[]
  subject: string
  htmlBody: string
  replyToAddresses?: string[]
}

export const createSendEmailCommand = ({
  fromAddress = process.env.SES_FROM_ADDRESS,
  toAddresses,
  ccAddresses,
  subject,
  htmlBody,
  replyToAddresses
}: SendEmailCommandParams) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: ccAddresses,
      ToAddresses: toAddresses
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses
  })
}

export const sendEmail = async ({ ...params }: SendEmailCommandParams) => {
  try {
    const result = await sesClient.send(createSendEmailCommand(params))
    console.log('send email success', result)
    return result
  } catch (error) {
    console.log(error)
    return error
  }
}

export const emailTemplate = fs.readFileSync(path.resolve('src/utils/email-template.html'), 'utf-8')

interface EmailBodyTemplateParams {
  title: string
  content: string
  titleLink: string
}

export const generateEmailBodyFromTemplate = ({ title, content, titleLink }: EmailBodyTemplateParams) => {
  return emailTemplate.replace('{{title}}', title).replace('{{content}}', content).replace('{{titleLink}}', titleLink)
}
