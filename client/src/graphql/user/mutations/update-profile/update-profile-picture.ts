import { gql } from '@apollo/client';

export const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateProfilePicture($userId: Int!, $profileImage: Upload!) {
    updateProfilePic(userId: $userId, profileImage: $profileImage) {
      status
      message
    }
  }
`;
