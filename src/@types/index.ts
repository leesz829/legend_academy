import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, ScrollView, View, TouchableOpacity } from 'react-native';

export type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<StackParamList>,
  BottomTabNavigationProp<BottomParamList>
>;

export type RootParamList = {
  BottomNavigation: undefined;
  StackNavigation: undefined;
};

export type StackParamList = {
  Main: NavigatorScreenParams<BottomParamList>;
  StartPage: undefined;
  Login: undefined;
  Home: undefined;
  Title00: undefined;
  NiceAuth: {
    type: string;
    phoneNumber: string;
    emailId: string;
    mrktAgreeYn: string;
  };
  Policy: undefined;
  SignUp_Check: undefined;
  SignUp_ID: undefined;
  SignUp_Password: undefined;
  SignUp_Image: undefined;
  SignUp_Nickname: undefined;
  SignUp_Comment: undefined;
  SignUp_AddInfo: undefined;
  SignUp_Interest: undefined;
  SignUp_Introduce: undefined;
  SignUp_Auth: undefined;
  Approval: {
    memberSeq: Number;
  };
  SecondAuthPopup: undefined; // 2차 인증 팝업
  LivePopup: undefined;
  Board: undefined; // 게시판 메인
  BoardDetail: undefined; // 게시판 상세
  Preference: undefined;
  Profile: undefined;
  Profile1: {
    isInterViewMove: boolean;
  };
  SecondAuth: undefined;
  ItemMatching: undefined;
  MatchDetail: {
    type: string;
    matchSeq: Number;
    trgtMemberSeq: Number;
    memberSeqList: [];
    matchType: string;
    message: string;
  };
  ImagePreview: {
    imgList: [];
    orderSeq: Number;
  };
  TutorialSetting: undefined;
  AlarmSetting: undefined;
  ProfileImageSetting: undefined;
  StoryRegi: {
    storyBoardSeq: Number;
    nicknameModifier: string;
    nicknameNoun: string;
    contents: string;
    imgList: [];
  };
  StoryEdit: {
    storyBoardSeq: Number;
    imgList: [];
    contents: string;
  };
  StoryDetail: {
    storyBoardSeq: Number;
  };
  StoryActive: undefined;

  Profile_AddInfo: undefined;
  Profile_Auth: undefined;
  Profile_Interest: undefined;
  Profile_Introduce: undefined;
  MyHome: {
    trgtMemberSeq: Number;
  };
};

export type BottomParamList = {
  Roby: undefined;
  Message: undefined;
  Cashshop: undefined;
  Storage: {
    headerType: String;
  };
  Live: undefined;
  MatchingList: undefined;
  Shop: undefined;
  Story: {
    isRefresh: boolean
  };
  Main: undefined;
};

export type StackScreenProp = NativeStackNavigationProp<StackParamList>;
export type BottomScreenProp = NativeStackNavigationProp<BottomParamList>;

export enum ColorType {
  white = 'white',
  primary = '#7986ed',
  gray6666 = '#666666',
  grayEEEE = '#eeeeee',
  black0000 = '#000000',
  black2222 = '#222222',
  black3333 = '#333333',
  purple = '#8854d1',
  grayDDDD = '#dddddd',
  grayF8F8 = '#f8f8f8',
  gray8888 = '#888888',
  grayAAAA = '#aaaaaa',
  grayb1b1 = '#b1b1b1',
  red = '#ff0000',
  redF20456 = '#fe0456',
  blue697A = '#697AE6',
  blue7986 = '#7986EE',
  goldD5CD = '#D5CD9E',
}

export type WeightType =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export const LabelObj = {
  label: '',
  value: '',
};

export const CommonCode = {
  common_code: '',
  group_code: '',
  code_name: '',
  code_memo: '',
  order_seq: '',
  use_yn: '',
};

export const Interview = {
  common_code: '',
  code_name: '',
  answer: '',
  order_seq: '',
};

export const MemberBaseData = {
  member_seq: '',
  kakao_id: '',
  nickname: '',
  name: '',
  comment: '',
  status: '',
  admin_yn: '',
  age: '',
  gender: '',
  phone_number: '',
  member_auth_seq: '',
  birthday: '',
  join_appr_dt: '',
  join_dt: '',
  match_yn: '',
  local_seq1: '',
  local_seq2: '',
  inactive_dt: '',
  rank: '',
  introduce_comment: '',
  business: '',
  job: '',
  job_name: '',
  birth_local: '',
  active_local: '',
  height: '',
  form_body: '',
  religion: '',
  drinking: '',
  smoking: '',
  friend_match_yn: '',
  grade_score: '',
  member_level: '',
  profile_tier: '',
  profile_score: '',
  profile_type: '',
};

export const FileInfo = {
  member_seq: '',
  name: '',
  profile_type: '',
  comment: '',
  gender: '',
  age: '',
  file_seq: '',
  file_path: '',
  file_name: '',
};

export const ProfileImg = {
  url: '',
  member_seq: '',
  name: '',
  age: '',
  comment: '',
  profile_type: '',
};

export const MemberIdealTypeData = {
  ideal_type_seq: '',
  member_seq: '',
  want_local1: '',
  want_local2: '',
  want_age_min: '',
  want_age_max: '',
  want_business1: '',
  want_business2: '',
  want_business3: '',
  want_job1: '',
  want_job2: '',
  want_job3: '',
  want_person1: '',
  want_person2: '',
  want_person3: '',
};

// Live 매칭 회원 기본 정보
export const LiveMemberInfo  = {
  member_seq : ''
  , name : ''
  , gender : ''
  , comment : ''
  , status : ''
  , age : ''
  , approval_profile_seq : ''
};

// Live 매칭 회원 프로필 사진 정보
export const LiveProfileImg  = {
  member_img_seq : ''
  , order_seq : ''
  , img_file_path : ''
  , url : ''
};