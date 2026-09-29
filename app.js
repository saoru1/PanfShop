import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { colors } from './lib/theme';
import { Loading } from './components/UI';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import ProfileScreen from './screens/ProfileScreen';

import StaffCategoriesScreen from './screens/staff/StaffCategoriesScreen';
import StaffProductsScreen from './screens/staff/StaffProductsScreen';
import StaffOrdersScreen from './screens/staff/StaffOrdersScreen';
import StaffReportScreen from './screens/staff/StaffReportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '800' },
  contentStyle: { backgroundColor: colors.bg },
};

const tabOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '800' },
  tabBarActiveTintColor: colors.crust,
  tabBarInactiveTintColor: colors.muted,
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
};

function icon(name) {
  return ({ color, size }) => <Ionicons name={name} color={color} size={size} />;
}

function CartBadge() {
  const { count } = useCart();
  if (!count) return null;
  return (
    <View style={{
      position: 'absolute', top: -4, right: -10, backgroundColor: colors.danger,
      borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 4,
    }}>
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{count}</Text>
    </View>
  );
}

function CustomerTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'สินค้า', tabBarLabel: 'สินค้า', tabBarIcon: icon('storefront-outline') }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          headerShown: false,
          tabBarLabel: 'ตะกร้า',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="bag-handle-outline" color={color} size={size} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{ title: 'คำสั่งซื้อของฉัน', tabBarLabel: 'ออร์เดอร์', tabBarIcon: icon('receipt-outline') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'บัญชีของฉัน', tabBarLabel: 'บัญชี', tabBarIcon: icon('person-outline') }}
      />
    </Tab.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'ตะกร้าสินค้า' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'ชำระเงิน' }} />
    </Stack.Navigator>
  );
}

function StaffTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions}>
      <Tab.Screen
        name="StaffOrders"
        component={StaffOrdersScreen}
        options={{ title: 'คำสั่งซื้อ', tabBarLabel: 'ออร์เดอร์', tabBarIcon: icon('receipt-outline') }}
      />
      <Tab.Screen
        name="StaffProducts"
        component={StaffProductsScreen}
        options={{ title: 'จัดการสินค้า', tabBarLabel: 'สินค้า', tabBarIcon: icon('pricetags-outline') }}
      />
      <Tab.Screen
        name="StaffCategories"
        component={StaffCategoriesScreen}
        options={{ title: 'หมวดสินค้า', tabBarLabel: 'หมวด', tabBarIcon: icon('grid-outline') }}
      />
      <Tab.Screen
        name="StaffReport"
        component={StaffReportScreen}
        options={{ title: 'รายงานยอดขาย', tabBarLabel: 'รายงาน', tabBarIcon: icon('bar-chart-outline') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'บัญชีพนักงาน', tabBarLabel: 'บัญชี', tabBarIcon: icon('person-outline') }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true, title: '' }} />
    </Stack.Navigator>
  );
}

function Root() {
  const { session, loading, isStaff } = useAuth();
  if (loading) return <Loading />;
  if (!session) return <AuthStack />;
  return isStaff ? <StaffTabs /> : <CustomerTabs />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
