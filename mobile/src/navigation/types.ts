export type RootStackParamList = {
  MainTabs: undefined;
  RestaurantDetail: { restaurantId: string };
  ReviewWrite: { restaurantId: string };
  ReviewEdit: { reviewId: string };
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Search: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Bookmarks: undefined;
  MyPage: undefined;
};
