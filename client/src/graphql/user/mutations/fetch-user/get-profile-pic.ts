import { gql } from '@apollo/client';

export const PROFILE_PIC_MUTATION= gql`
    mutation getProfilePic($userId: Int!) {
    getProfilePic(userId: $userId) {
      status
      message
      data {
          userId
          profileUrl
        }
    }
  }
`