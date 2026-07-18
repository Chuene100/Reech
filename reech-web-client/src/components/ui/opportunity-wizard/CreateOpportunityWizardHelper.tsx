import * as Yup from 'yup'

export interface ICreateAccount {
  cardTitle: string
  industry: string
  function: string
  level: string
  education: string
  experience: string
  location: string
  date: Date
  accountTeamSize: string
  accountName: string
  accountPlan: string
  businessName: string
  businessDescriptor: string
  businessType: string
  businessDescription: string
  businessEmail: string
  nameOnCard: string
  cardNumber: string
  cardExpiryMonth: string
  cardExpiryYear: string
  cardCvv: string
  saveCard: string
}

const createAccountSchemas = [
  Yup.object({
    cardTitle: Yup.string().required().label('Card Title'),
    industry: Yup.string().required().label('Industry'),
    function: Yup.string().required().label('Function'),
    level: Yup.string().required().label('Level'),
    education: Yup.string().required().label('Education'),
    experience: Yup.string().required().label('Experience'),
  }),
  Yup.object({
    date: Yup.string().required().label('Date'),
    location: Yup.string().required().label('Location'),
  }),
  Yup.object({
    businessName: Yup.string().required().label('Business Name'),
    businessDescriptor: Yup.string().required().label('Shortened Descriptor'),
    businessType: Yup.string().required().label('Corporation Type'),
    businessEmail: Yup.string().required().label('Contact Email'),
  }),
  Yup.object({
    nameOnCard: Yup.string().required().label('Name On Card'),
    cardNumber: Yup.string().required().label('Card Number'),
    cardExpiryMonth: Yup.string().required().label('Expiration Month'),
    cardExpiryYear: Yup.string().required().label('Expiration Year'),
    cardCvv: Yup.string().required().label('CVV'),
  }),
]

const inits: ICreateAccount = {
  cardTitle: '',
  industry: '',
  function: '',
  level: '',
  education: '',
  experience: '',
  date: new Date(),
  location: '',
  accountTeamSize: '50+',
  accountName: '',
  accountPlan: '1',
  businessName: 'Reech Enterprise.',
  businessDescriptor: 'Reech',
  businessType: '1',
  businessDescription: '',
  businessEmail: 'corp@support.com',
  nameOnCard: 'Max Doe',
  cardNumber: '4111 1111 1111 1111',
  cardExpiryMonth: '1',
  cardExpiryYear: '2025',
  cardCvv: '123',
  saveCard: '1',
}

export {createAccountSchemas, inits}
