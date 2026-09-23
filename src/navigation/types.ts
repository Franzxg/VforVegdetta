import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Product: { barcode: string };
  ProposeProduct: { barcode?: string } | undefined;
  Login: undefined;
  BecomeVolunteer: undefined;
  Settings: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
