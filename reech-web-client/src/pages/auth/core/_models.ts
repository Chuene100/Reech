export interface AuthModel {
    access_token: string
    refresh_token?: string
  }
  
  export interface UserAddressModel {
    addressLine: string
    city: string
    state: string
    postCode: string
  }
  
  export interface UserCommunicationModel {
    email: boolean
    sms: boolean
    phone: boolean
  }
  
  export interface UserSocialNetworksModel {
    linkedIn: string
    facebook: string
    twitter: string
    instagram: string
  }
  
  export interface UserModel {
    token: {
      access_token: string
      refresh_token?: string
    }
    user: {
      _id: string
      id: string
      profileID: any[]
      firstName: string
      lastName: string
      email: string
      phoneNumber: string
      identityNumber: string
      dateOfBirth: string
      empStatus: string
      verified: boolean
      __v?: number
      createdAt: string
      updatedAt: string
      profileImage: string
      coverImage: string
      address: string
      blurb: string
    }
    message: string
  }
  