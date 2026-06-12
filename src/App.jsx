import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Bean,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CupSoda,
  IceCreamBowl,
  Menu,
  Minus,
  PhoneCall,
  Package,
  Plus,
  MapPin,
  ShoppingBag,
  Trash2,
  Wheat,
  X,
} from 'lucide-react'
import { FaCookieBite, FaIceCream, FaMugHot } from 'react-icons/fa'
import { GiCoffeeBeans, GiCoffeeCup, GiCoffeePot, GiDonut, GiIceCube } from 'react-icons/gi'
import { LuCroissant } from "react-icons/lu";
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './App.css'

const PhoneInput = ReactPhoneInput?.default || ReactPhoneInput
import fallbackLogo from './assets/v67-logo.svg'
import CheckoutComplete from './components/CheckoutComplete'
import OrderNowModal from './components/OrderNowModal'
import HeroIconMarquee from './components/HeroIconMarquee'
import { clearPendingCheckout, readPendingCheckout } from './lib/checkout'
import { requestJson } from './config/api'
import { loadCatalog } from './lib/catalog'
import { getProductImageUrl } from './lib/media'
import { getStripe } from './lib/stripe'
const homeHeroLogo = '/v67_logo_C64429.webp'
const fallbackHero = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1800&q=85'
const fallbackImages = [
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
]
const fallbackProducts = [
  {
    id: 1,
    name: 'Velvet Latte',
    price: '5.75',
    description: 'Double espresso with silky steamed milk and a soft caramel finish.',
    category: { name: 'Coffee' },
    is_available: true,
  },
  {
    id: 2,
    name: 'Cardamom Cappuccino',
    price: '5.25',
    description: 'Aromatic espresso, microfoam, and a warm cardamom dusting.',
    category: { name: 'Coffee' },
    is_available: true,
  },
  {
    id: 3,
    name: 'Rose Cold Brew',
    price: '6.25',
    description: 'Slow-steeped cold brew lifted with rose and vanilla cream.',
    category: { name: 'Cold Drinks' },
    is_available: true,
  },
]
const fallbackCategories = [
  { id: 'coffee', name: 'Coffee', slug: 'coffee' },
  { id: 'cold-drinks', name: 'Cold Drinks', slug: 'cold-drinks' },
  { id: 'tea', name: 'Tea', slug: 'tea' },
]
const emptyAddress = {
  id: null,
  phone: '',
  town_city: '',
  address: '',
  villa_floor: '',
  is_default: false,
}
const pages = [
  {
    path: '/',
    label: 'Home',
    kicker: 'Since 1871',
    title: 'Fragrance of Dark Coffee',
    subtitle: 'The warmth of the tropics and the elegance of the newest recipes.',
  },
  {
    path: '/menu',
    label: 'Our Menu',
    kicker: 'Shop today’s menu',
    title: 'Order From the Daily Counter',
    subtitle: 'Live drink availability, prices, and remaining cups are loaded from the cafe backend.',
  },
  {
    path: '/about-us',
    label: 'About Us',
    kicker: 'The house standard',
    title: 'Small-Batch Service With a Clear Limit',
    subtitle: 'A calm ordering experience built around freshness, timing, and careful preparation.',
  },
  {
    path: '/contact-us',
    label: 'Contact Us',
    kicker: 'Contact and hours',
    title: 'Speak With the Cafe Team',
    subtitle: 'Use the contact details below for order support, delivery questions, and daily availability.',
  },
  {
    path: '/checkout',
    label: 'Checkout',
    kicker: 'Checkout',
    title: 'Confirm Your Order Details',
    subtitle: 'Review the selected drinks, adjust quantities, and send the order to the kitchen.',
  },
]

const translations = {
  en: {
    languageName: 'English',
    languageShort: 'EN',
    alternateLanguage: 'العربية',
    all: 'All',
    drink: 'Drink',
    cups: 'cups',
    each: 'each',
    addToCart: 'Add to cart',
    unavailable: 'Unavailable',
    soldOut: 'Sold Out',
    soldOutTitle: 'Sold out for today',
    soldOutTomorrow: 'See you tomorrow',
    orderNow: 'Order Now',
    notification: 'Notification',
    noticeTitleSuccess: 'Done',
    noticeTitleError: 'Attention',
    dismissNotification: 'Dismiss notification',
    openMenu: 'Open menu',
    openCart: 'Open cart',
    closeCart: 'Close cart',
    closeMenu: 'Close menu',
    yourCart: 'Your Cart',
    noDrinksYet: 'No drinks added yet.',
    goToCheckout: 'Go to checkout',
    menu: 'Menu',
    mobileMenu: 'Mobile menu',
    mainNavigation: 'Main navigation',
    mobileNavigation: 'Mobile navigation',
    cafeHighlights: 'Cafe highlights',
    cafeHighlightsCta: 'Cafe highlights under order button',
    dailyCupProgress: 'Daily cup progress',
    cupsSoldOutToday: 'cups sold out today',
    cupsServedToday: 'cups served today',
    allRightsReserved: 'All rights reserved.',
    shopMenu: 'Shop menu',
    noProductsYet: 'No drinks are available yet.',
    cartItems: 'Cart items',
    reviewDrinks: 'Review your drinks',
    noItemsStartFromMenu: 'No items added yet. Start from the menu page.',
    deliveryDetails: 'Delivery details',
    deliveryInformation: 'Delivery information',
    fullName: 'Full name',
    phoneNumber: 'Phone number',
    enterValidPhone: 'Enter a valid phone number with country code.',
    carNumber: 'Car number',
    notes: 'Notes',
    placeOrder: 'Place order',
    memberAccess: 'Member Access',
    welcomeBackTo: 'Welcome Back to',
    signInHelp: 'Sign in to access your account, manage orders, and update your delivery details.',
    benefitOne: 'Track your recent orders with live status.',
    benefitTwo: 'Save your address and speed up checkout.',
    benefitThree: 'Recover your password from the same form.',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    loginHelp: 'Use your account credentials to continue.',
    registerHelp: 'Set up your account details to get started.',
    forgotHelp: 'Enter your email to receive a 6-digit OTP.',
    resetHelp: 'Enter the OTP from your email and choose your new password.',
    name: 'Name',
    phone: 'Phone',
    townCity: 'Town / City',
    address: 'Address',
    villaFloor: 'Villa No. / Floor No.',
    email: 'Email',
    password: 'Password',
    enterPassword: 'Enter your password',
    forgotPasswordQ: 'Forgot password?',
    createAccountQ: 'Create account',
    backToSignIn: 'Back to sign in',
    login: 'Login',
    sendOtp: 'Send OTP',
    alreadyHaveOtp: 'Already have an OTP code?',
    otpCode: 'OTP code',
    otpPlaceholder: 'Enter 6-digit OTP',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    resendOtp: 'Resend OTP',
    resendIn: 'Resend in',
    accountCreated: 'Account created successfully.',
    loggedIn: 'Logged in successfully.',
    otpSent: 'Verification code sent.',
    passwordReset: 'Password updated successfully.',
    profileUpdated: 'Profile updated successfully.',
    loggedOut: 'Signed out successfully.',
    cartEmpty: 'Your cart is empty.',
    cupsNotEnough: 'Not enough cups remain today for this cart.',
    mobileRequired: 'Mobile number is required to place the order.',
    placeOrderFail: 'Failed to place order.',
    paymentProcessingFail: 'Payment is still processing. Check your orders shortly.',
    completingPayment: 'Completing your payment',
    completingPaymentBody: 'Please wait while we confirm your order.',
    checkoutSessionMissing: 'We could not find your checkout session. If you were charged, contact the cafe.',
    loyaltyFail: 'Failed to check loyalty status.',
    orderPlaced: 'Your order has been received successfully.',
    pages: {
      '/': {
        label: 'Home',
        kicker: 'Since 1871',
        title: 'Fragrance of Dark Coffee',
        subtitle: 'The warmth of the tropics and the elegance of the newest recipes.',
      },
      '/menu': {
        label: 'Our Menu',
        kicker: 'Shop today\'s menu',
        title: 'Order From the Daily Counter',
        subtitle: 'Live drink availability, prices, and remaining cups are loaded from the cafe backend.',
      },
      '/about-us': {
        label: 'About Us',
        kicker: 'The house standard',
        title: 'Small-Batch Service With a Clear Limit',
        subtitle: 'A calm ordering experience built around freshness, timing, and careful preparation.',
      },
      '/contact-us': {
        label: 'Contact Us',
        kicker: 'Contact and hours',
        title: 'Speak With the Cafe Team',
        subtitle: 'Use the contact details below for order support, delivery questions, and daily availability.',
      },
      '/checkout': {
        label: 'Checkout',
        kicker: 'Checkout',
        title: 'Confirm Your Order Details',
        subtitle: 'Review the selected drinks, adjust quantities, and send the order to the kitchen.',
      },
    },
  },
  ar: {
    languageName: 'العربية الخليجية',
    languageShort: 'AR',
    alternateLanguage: 'English',
    all: 'الكل',
    drink: 'مشروب',
    cups: 'كوب',
    each: 'للكوب',
    addToCart: 'ضيف للسلة',
    unavailable: 'غير متوفر',
    soldOut: 'خلصت الكمية',
    soldOutTitle: 'خلصت الكمية',
    soldOutTomorrow: 'حياك باجر',
    orderNow: 'اطلب الحين',
    notification: 'تنبيه',
    noticeTitleSuccess: 'تم بنجاح',
    noticeTitleError: 'تنبيه مهم',
    dismissNotification: 'إغلاق التنبيه',
    openMenu: 'فتح القائمة',
    openCart: 'فتح السلة',
    closeCart: 'إغلاق السلة',
    closeMenu: 'إغلاق القائمة',
    yourCart: 'سلتك',
    noDrinksYet: 'ما ضفت أي مشروبات للحين.',
    goToCheckout: 'روح لإتمام الطلب',
    menu: 'القائمة',
    mobileMenu: 'قائمة الجوال',
    mainNavigation: 'التنقل الرئيسي',
    mobileNavigation: 'تنقل الجوال',
    cafeHighlights: 'مميزات الكافيه',
    cafeHighlightsCta: 'مميزات الكافيه تحت زر الطلب',
    dailyCupProgress: 'تقدم أكواب اليوم',
    cupsSoldOutToday: 'انتهت أكواب اليوم',
    cupsServedToday: 'كم واصلين اليوم',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    shopMenu: 'منيو الطلب',
    noProductsYet: 'للحين ما فيه مشروبات متاحة.',
    cartItems: 'عناصر السلة',
    reviewDrinks: 'راجع مشروباتك',
    noItemsStartFromMenu: 'ما فيه عناصر مضافة. ابدأ من صفحة المنيو.',
    deliveryDetails: 'تفاصيل التسليم',
    deliveryInformation: 'بيانات التسليم',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الجوال',
    enterValidPhone: 'اكتب رقم جوال صحيح مع مفتاح الدولة.',
    carNumber: 'رقم السيارة',
    notes: 'ملاحظات',
    placeOrder: 'تأكيد الطلب',
    memberAccess: 'دخول الأعضاء',
    welcomeBackTo: 'حياك الله من جديد في',
    signInHelp: 'سجّل دخولك عشان تدير حسابك وطلباتك وتحدّث بيانات التوصيل.',
    benefitOne: 'تابع طلباتك الأخيرة بحالة مباشرة.',
    benefitTwo: 'احفظ عنوانك وخلّص الطلب بسرعة.',
    benefitThree: 'تقدر تسترجع كلمة المرور من نفس النموذج.',
    signIn: 'تسجيل دخول',
    createAccount: 'إنشاء حساب',
    forgotPassword: 'نسيت كلمة المرور',
    resetPassword: 'إعادة تعيين كلمة المرور',
    loginHelp: 'استخدم بيانات حسابك للمتابعة.',
    registerHelp: 'أدخل بياناتك وأنشئ حسابك بسرعة.',
    forgotHelp: 'اكتب إيميلك عشان يوصلك رمز OTP من 6 أرقام.',
    resetHelp: 'اكتب رمز OTP اللي وصلك واختر كلمة مرور جديدة.',
    name: 'الاسم',
    phone: 'الجوال',
    townCity: 'المنطقة / المدينة',
    address: 'العنوان',
    villaFloor: 'رقم الفيلا / رقم الطابق',
    email: 'الإيميل',
    password: 'كلمة المرور',
    enterPassword: 'اكتب كلمة المرور',
    forgotPasswordQ: 'نسيت كلمة المرور؟',
    createAccountQ: 'إنشاء حساب',
    backToSignIn: 'رجوع لتسجيل الدخول',
    login: 'دخول',
    sendOtp: 'إرسال OTP',
    alreadyHaveOtp: 'عندك رمز OTP جاهز؟',
    otpCode: 'رمز OTP',
    otpPlaceholder: 'اكتب رمز OTP من 6 أرقام',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    resendOtp: 'إعادة إرسال OTP',
    resendIn: 'إعادة الإرسال بعد',
    accountCreated: 'تم إنشاء الحساب بنجاح.',
    loggedIn: 'تم تسجيل الدخول بنجاح.',
    otpSent: 'تم إرسال رمز التحقق.',
    passwordReset: 'تم تحديث كلمة المرور بنجاح.',
    profileUpdated: 'تم تحديث بياناتك بنجاح.',
    loggedOut: 'تم تسجيل الخروج بنجاح.',
    cartEmpty: 'سلتك فاضية.',
    cupsNotEnough: 'الكمية المتبقية اليوم ما تكفي لهالسلة.',
    mobileRequired: 'رقم الجوال مطلوب لإتمام الطلب.',
    placeOrderFail: 'صار خطأ في إرسال الطلب.',
    paymentProcessingFail: 'الدفع لسه قيد المعالجة. راجع طلباتك بعد شوي.',
    completingPayment: 'جاري إتمام الدفع',
    completingPaymentBody: 'انتظر شوي لحد ما نأكد طلبك.',
    checkoutSessionMissing: 'ما لقينا جلسة الدفع. إذا انخصم المبلغ، تواصل مع المقهى.',
    loyaltyFail: 'صار خطأ أثناء التحقق من الولاء.',
    orderPlaced: 'تم استلام طلبك بنجاح.',
    pages: {
      '/': {
        label: 'الرئيسية',
        kicker: 'من 1871',
        title: 'عبق القهوة الداكنة',
        subtitle: 'دفا المناطق الاستوائية مع لمسة وصفات عصرية.',
      },
      '/menu': {
        label: 'المنيو',
        kicker: 'اطلب من منيو اليوم',
        title: 'اطلب مباشرة من كاونتر اليوم',
        subtitle: 'توفّر المشروبات والأسعار والكمية المتبقية تتحدث مباشرة من النظام.',
      },
      '/about-us': {
        label: 'من نحن',
        kicker: 'معيار البيت',
        title: 'خدمة دفعات صغيرة بحد يومي واضح',
        subtitle: 'تجربة طلب هادئة مبنية على الطزاجة والتوقيت والتحضير الدقيق.',
      },
      '/contact-us': {
        label: 'تواصل معنا',
        kicker: 'التواصل وساعات العمل',
        title: 'تواصل مع فريق الكافيه',
        subtitle: 'تواصل معنا لدعم الطلبات والاستفسارات وتوفر المنيو اليومي.',
      },
      '/checkout': {
        label: 'إتمام الطلب',
        kicker: 'إتمام الطلب',
        title: 'أكد تفاصيل طلبك',
        subtitle: 'راجع مشروباتك وعدّل الكميات ثم أرسل الطلب للمطبخ.',
      },
    },
  },
}

function getTranslation(language, key) {
  const keys = key.split('.')
  let value = translations[language]

  for (const part of keys) {
    value = value?.[part]
  }

  if (value !== undefined) {
    return value
  }

  let fallbackValue = translations.en
  for (const part of keys) {
    fallbackValue = fallbackValue?.[part]
  }

  return fallbackValue ?? key
}

function normalizePath(pathname) {
  if (pathname === '/checkout/complete') {
    return '/checkout/complete'
  }

  return pages.some((page) => page.path === pathname) ? pathname : '/'
}

function money(value, locale = 'en-AE') {
  const amount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
  const label = locale.startsWith('ar') ? `${amount} درهم إماراتي` : `AED ${amount}`

  return (
    <span className={`money-value${locale.startsWith('ar') ? ' is-arabic' : ''}`} aria-label={label}>
      {locale.startsWith('ar') ? <span>{amount}</span> : null}
      <span className="money-symbol" aria-hidden="true" />
      {!locale.startsWith('ar') ? <span>{amount}</span> : null}
    </span>
  )
}

function shortTime(value) {
  return String(value || '').slice(0, 5) || '08:00'
}

function normalizeWhatsAppLink(value) {
  const digits = String(value || '').replace(/\D/g, '')

  return digits ? `https://wa.me/${digits}` : '#'
}

function normalizePhoneForStorage(value) {
  const digits = String(value || '').replace(/\D/g, '')

  return digits ? `+${digits}` : ''
}

function normalizePhoneForInput(value) {
  return String(value || '').replace(/\D/g, '')
}

function isValidInternationalPhone(value) {
  return /^\+\d{8,15}$/.test(String(value || ''))
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-3.37-3.37 4 4 0 0 1 3.37 3.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function CafeCupIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M15 11h2.4a2.6 2.6 0 1 1 0 5.2H15" />
      <path d="M6 22h10" />
      <path d="M8.5 7.4c0-.9.8-1.4 1.2-2" />
      <path d="M11.5 7.4c0-.9.8-1.4 1.2-2" />
    </svg>
  )
}

function CoffeeBeanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 4c4.4 0 8 3.3 8 8s-3.6 8-8 8-8-3.3-8-8 3.6-8 8-8z" />
      <path d="M13.2 5.6c-2.3 2.4-3 4.4-2.5 6.6.5 2.2 1.9 3.9 3.7 6.2" />
    </svg>
  )
}

function CroissantIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5.5 15.5c0-3.9 2.9-7 6.5-7s6.5 3.1 6.5 7" />
      <path d="M5.5 15.5a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3" />
      <path d="M8.2 11.3c1.1.8 2.4 1.2 3.8 1.2 1.5 0 2.8-.4 3.8-1.2" />
    </svg>
  )
}

function CoffeeSteamIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 6c1 1.1 1 2.4 0 3.5" />
      <path d="M12 4c1.3 1.3 1.3 3 0 4.3" />
      <path d="M16 6c1 1.1 1 2.4 0 3.5" />
      <path d="M5 12h11v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
      <path d="M16 13h1.6a1.8 1.8 0 0 1 0 3.6H16" />
    </svg>
  )
}

function EspressoShotIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 9h10v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
      <path d="M15 10h1.8a1.7 1.7 0 0 1 0 3.4H15" />
      <path d="M7 21h8" />
      <path d="M7 7h6" />
    </svg>
  )
}

function DonutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M8.4 8.9c.6-.5 1.2-.7 1.9-.6" />
      <path d="M14.1 8.3c.6 0 1.1.2 1.6.6" />
      <path d="M15.2 15.1c-.5.5-1.1.8-1.8.8" />
    </svg>
  )
}

function CookieIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="10" cy="9.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="9.8" cy="14.2" r=".8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14.8" r=".8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3v18" />
      <path d="M4.2 7.5 19.8 16.5" />
      <path d="M19.8 7.5 4.2 16.5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function FrenchPressIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 4h8" />
      <path d="M12 4v5" />
      <path d="M7 9h10v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M17 11h1.5a1.5 1.5 0 0 1 0 3H17" />
    </svg>
  )
}

function ColdBrewIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 4h8" />
      <path d="M9 4v2" />
      <path d="M15 4v2" />
      <path d="M7 8h10l-1 10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
      <path d="M10 12h4" />
      <path d="M10 15h4" />
    </svg>
  )
}

function GrinderIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 5h8" />
      <path d="M12 5v2" />
      <path d="M9 8h6v4H9z" />
      <path d="M7 12h10v5a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" />
      <path d="M17 14h2" />
    </svg>
  )
}

function normalizeAddresses(user) {
  const addresses = user?.addresses || []

  if (addresses.length > 0) {
    return addresses.map((address, index) => ({
      id: address.id || null,
      phone: address.phone || '',
      town_city: address.town_city || '',
      address: address.address || '',
      villa_floor: address.villa_floor || '',
      is_default: Boolean(address.is_default ?? index === 0),
    }))
  }

  if (user?.delivery_address || user?.phone) {
    return [{
      ...emptyAddress,
      phone: user.phone || '',
      address: user.delivery_address || '',
      is_default: true,
    }]
  }

  return [{ ...emptyAddress, is_default: true }]
}

function formatAddress(address) {
  return [address.address, address.villa_floor, address.town_city].filter(Boolean).join(', ')
}

function normalizePhoneForLoyalty(value) {
  const digits = String(value || '').replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (digits.startsWith('971') && digits.length === 12) {
    return `0${digits.slice(3)}`
  }

  if (digits.startsWith('5') && digits.length === 9) {
    return `0${digits}`
  }

  return digits
}

function getFirstErrorMessage(error, fallback) {
  if (error?.errors) {
    const firstEntry = Object.values(error.errors)[0]
    if (Array.isArray(firstEntry) && firstEntry[0]) {
      return firstEntry[0]
    }
  }

  return error?.message || fallback
}

function createNotice(message, tone = 'success') {
  return { message, tone }
}

function App() {
  const [catalog, setCatalog] = useState(null)
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [language, setLanguage] = useState('ar')
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cafe67_cart') || '[]')

      return Array.isArray(savedCart) ? savedCart : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderModalInitialStep, setOrderModalInitialStep] = useState(1)
  const [notice, setNotice] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [token, setToken] = useState(() => localStorage.getItem('cafe67_token'))
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all')
  const categorySliderRef = useRef(null)
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false)
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    town_city: '',
    address: '',
    villa_floor: '',
  })
  const [forgotForm, setForgotForm] = useState({ email: '' })
  const [resetForm, setResetForm] = useState({
    email: '',
    otp: '',
    password: '',
    password_confirmation: '',
  })
  const [resendAvailableAt, setResendAvailableAt] = useState(null)
  const [resendNow, setResendNow] = useState(() => Date.now())
  const [accountView, setAccountView] = useState('dashboard')
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
  })
  const [userAddresses, setUserAddresses] = useState([{ ...emptyAddress, is_default: true }])
  const [selectedCheckoutAddressId, setSelectedCheckoutAddressId] = useState(null)
  const [checkoutForm, setCheckoutForm] = useState({
    customer_name: '',
    customer_phone: '',
    cup_type: 'carton',
    car_type: '',
    car_number: '',
    delivery_address: '',
    customer_notes: '',
    use_free_cup: false,
    free_cups_to_use: '',
  })
  const [loyaltyState, setLoyaltyState] = useState({
    loading: false,
    data: null,
    error: '',
  })
  const [paymentConfig, setPaymentConfig] = useState({
    enabled: false,
    publishable_key: null,
    currency: 'aed',
    return_url: null,
    payment_element: {
      wallets: {
        applePay: 'auto',
        googlePay: 'auto',
      },
    },
  })
  const [modalPendingOrder, setModalPendingOrder] = useState(null)
  const locale = language === 'ar' ? 'ar-AE' : 'en-AE'
  const isArabic = language === 'ar'
  const t = (key) => getTranslation(language, key)
  const translateTemplate = (key, values = {}) => {
    const template = t(key)
    return Object.entries(values).reduce(
      (text, [token, tokenValue]) => text.replaceAll(`{${token}}`, String(tokenValue)),
      template,
    )
  }

  const hydrateAccount = async (authToken) => {
    const [me, history] = await Promise.all([
      requestJson('/auth/me', {}, authToken),
      requestJson('/orders', {}, authToken),
    ])

    const addresses = normalizeAddresses(me.user)

    setUser(me.user)
    setOrders(history.orders || [])
    setProfileForm({
      name: me.user.name || '',
      phone: me.user.phone || '',
    })
    setUserAddresses(addresses)
    setCheckoutForm((current) => ({
      ...current,
      customer_name: current.customer_name || me.user.name || '',
      customer_phone: current.customer_phone || addresses.find((address) => address.is_default)?.phone || me.user.phone || '',
      delivery_address: current.delivery_address || formatAddress(addresses.find((address) => address.is_default) || addresses[0]) || '',
    }))
    setSelectedCheckoutAddressId(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || 'local-0')
  }

  useEffect(() => {
    let active = true
    let hasLoadedOnce = false

    const refreshCatalog = async ({ showErrorNotice = false } = {}) => {
      try {
        const data = await loadCatalog()

        if (!active) {
          return
        }

        setCatalog(data)
        hasLoadedOnce = true
      } catch (error) {
        if (active && showErrorNotice) {
          setNotice(createNotice(error.message, 'error'))
        }
      } finally {
        if (active) {
          setIsCatalogLoading(false)
        }
      }
    }

    refreshCatalog({ showErrorNotice: true })

    const interval = window.setInterval(() => {
      if (!hasLoadedOnce) {
        return
      }

      loadCatalog({ force: true })
        .then((data) => {
          if (active) {
            setCatalog(data)
          }
        })
        .catch(() => null)
    }, 30000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let active = true

    requestJson('/payments/config', {}, null)
      .then((data) => {
        if (!active) {
          return
        }

        setPaymentConfig(data.payment || {
          enabled: false,
          publishable_key: null,
          currency: 'aed',
          return_url: null,
          payment_element: {
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
          },
        })
      })
      .catch(() => null)

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    let active = true

    Promise.all([
      requestJson('/auth/me', {}, token),
      requestJson('/orders', {}, token),
    ])
      .then(([me, history]) => {
        if (!active) {
          return
        }

        const addresses = normalizeAddresses(me.user)

        setUser(me.user)
        setOrders(history.orders || [])
        setProfileForm({
          name: me.user.name || '',
          phone: me.user.phone || '',
        })
        setUserAddresses(addresses)
        setCheckoutForm((current) => ({
          ...current,
          customer_name: current.customer_name || me.user.name || '',
          customer_phone: current.customer_phone || addresses.find((address) => address.is_default)?.phone || me.user.phone || '',
          delivery_address: current.delivery_address || formatAddress(addresses.find((address) => address.is_default) || addresses[0]) || '',
        }))
        setSelectedCheckoutAddressId(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || 'local-0')
      })
      .catch(() => {
        localStorage.removeItem('cafe67_token')
        setToken(null)
        setUser(null)
        setOrders([])
      })

    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname))
    const handleScroll = () => setScrolled(window.scrollY > 40)

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!resendAvailableAt) {
      return undefined
    }

    const interval = window.setInterval(() => setResendNow(Date.now()), 1000)

    return () => window.clearInterval(interval)
  }, [resendAvailableAt])

  useEffect(() => {
    localStorage.setItem('cafe67_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timeout = window.setTimeout(() => setNotice(null), 4000)

    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    localStorage.setItem('cafe67_language', language)
    document.documentElement.lang = isArabic ? 'ar' : 'en'
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [isArabic, language])

  const pageTranslations = useMemo(() => t('pages'), [language])
  const activePage = useMemo(() => {
    const page = pages.find((entry) => entry.path === path) || pages[0]
    const translated = pageTranslations?.[page.path] || {}

    return {
      ...page,
      label: translated.label || page.label,
      kicker: translated.kicker || page.kicker,
      title: translated.title || page.title,
      subtitle: translated.subtitle || page.subtitle,
    }
  }, [pageTranslations, path])
  const navPages = useMemo(
    () => pages
      .map((page) => {
        const translated = pageTranslations?.[page.path] || {}
        return {
          ...page,
          label: translated.label || page.label,
        }
      })
      .filter((page) => page.path !== '/checkout'),
    [pageTranslations],
  )
  const settings = catalog?.settings || {
    cafe_name: 'Cafe 67',
    logo_url: fallbackLogo,
    phone: '+1 555 670 067',
    whatsapp: '+1 555 670 067',
    opens_at: '08:00',
    closes_at: '21:00',
  }
  const banner = catalog?.banner || {}
  const activeHeroSlide = useMemo(() => {
    const bannerImage = banner.background_image_url || fallbackHero

    return {
      id: 'signature',
      kicker: 'House selection',
      title: banner.title || activePage.title,
      description: banner.description || activePage.subtitle,
      image: bannerImage,
      colorA: '#FFF8D4',
      colorB: '#FFF8D4',
      colorC: '#76593B',
    }
  }, [activePage.subtitle, activePage.title, banner.background_image_url, banner.description, banner.title])
  const products = useMemo(() => {
    if (catalog?.products?.length) {
      return catalog.products
    }

    return fallbackProducts
  }, [catalog])
  const orderModalProducts = useMemo(() => {
    if (catalog?.products?.length) {
      return catalog.products
    }

    return isCatalogLoading ? [] : fallbackProducts
  }, [catalog, isCatalogLoading])
  const categories = useMemo(
    () => (catalog?.categories?.length ? catalog.categories : fallbackCategories),
    [catalog],
  )
  const isDailyLimitReady = Boolean(catalog?.daily_limit) && !isCatalogLoading
  const dailyLimit = catalog?.daily_limit
  const orderedCount = isDailyLimitReady && Number.isFinite(Number(dailyLimit.accepted_cups))
    ? Number(dailyLimit.accepted_cups)
    : 0
  const cupLimit = isDailyLimitReady && Number.isFinite(Number(dailyLimit.limit))
    ? Number(dailyLimit.limit)
    : 99
  const soldOut = isDailyLimitReady && (
    Boolean(dailyLimit.sold_out) || orderedCount >= cupLimit
  )
  const isOrderingDisabled = !isDailyLimitReady || soldOut
  const phoneDigits = String(settings.phone || '').replace(/[^\d+]/g, '')
  const socialLinks = {
    call: phoneDigits ? `tel:${phoneDigits}` : '#',
    instagram: settings.social_links?.instagram || '#',
    location: settings.social_links?.location || settings.social_links?.maps || settings.location_url || '#',
  }
  const marqueeItems = useMemo(
    () => [
      { id: 'v60', label: 'V60', iconSrc: '/v60.svg' },
      { id: 'pourover', label: 'Pourover', iconSrc: '/pour-over.svg' },
      { id: 'beans', label: 'Beans', iconSrc: '/coffee-beans.svg' },
      { id: 'ice', label: 'Ice', iconSrc: '/melting.svg' },
    ],
    [],
  )

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.product_id),
        }))
        .filter((item) => item.product),
    [cart, products],
  )
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0,
  )
  const cartCups = cartItems.reduce((total, item) => total + item.quantity, 0)
  const activeCategorySlug = selectedCategorySlug === 'all'
    ? 'all'
    : (categories.some((category) => category.slug === selectedCategorySlug) ? selectedCategorySlug : 'all')

  const filteredProducts = activeCategorySlug === 'all'
    ? products
    : products.filter((product) => product.category?.slug === activeCategorySlug)
  const resendRemainingSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - resendNow) / 1000))
    : 0
  const canResendOtp = resendRemainingSeconds === 0
  const isCheckoutPhoneValid = isValidInternationalPhone(checkoutForm.customer_phone)

  useEffect(() => {
    if (!orderModalOpen) {
      return
    }

    const mobileNumber = normalizePhoneForLoyalty(checkoutForm.customer_phone)

    if (!mobileNumber) {
      setLoyaltyState({ loading: false, data: null, error: '' })
      return
    }

    let active = true

    setLoyaltyState((current) => ({ ...current, loading: true, error: '' }))

    const timeout = window.setTimeout(() => {
      requestJson(
        '/loyalty/check',
        {
          method: 'POST',
          body: JSON.stringify({ mobile_number: mobileNumber }),
        },
        token,
      )
        .then((data) => {
          if (!active) {
            return
          }

          setLoyaltyState({ loading: false, data, error: '' })
        })
        .catch((error) => {
          if (!active) {
            return
          }

          setLoyaltyState({
            loading: false,
            data: null,
            error: getFirstErrorMessage(error, t('loyaltyFail')),
          })
        })
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [checkoutForm.customer_phone, orderModalOpen, token])

  useEffect(() => {
    const slider = categorySliderRef.current
    if (!slider) {
      setCanScrollCategoriesLeft(false)
      setCanScrollCategoriesRight(false)
      return
    }

    const updateScrollState = () => {
      setCanScrollCategoriesLeft(slider.scrollLeft > 4)
      setCanScrollCategoriesRight(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 4)
    }

    updateScrollState()
    slider.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      slider.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [categories.length, path])

  const openPage = (nextPath, event) => {
    event?.preventDefault()
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    setCartOpen(false)
    setMobileMenuOpen(false)
    setOrderModalOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openOrderModal = (step = 1) => {
    if (isOrderingDisabled) {
      return
    }

    setOrderModalInitialStep(step)
    setCartOpen(false)
    setOrderModalOpen(true)
  }

  const closeOrderModal = () => {
    setOrderModalOpen(false)
    setModalPendingOrder(null)
  }

  const addToCart = (product) => {
    if (isOrderingDisabled || !product.is_available) {
      return
    }

    setCart((current) => {
      const existing = current.find((item) => item.product_id === product.id)
      if (existing) {
        return current.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { product_id: product.id, quantity: 1 }]
    })
  }

  const setQuantity = (productId, quantity) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const scrollCategories = (direction) => {
    const slider = categorySliderRef.current
    if (!slider) {
      return
    }

    slider.scrollBy({ left: direction * 280, behavior: 'smooth' })
  }

  const submitAuth = async (event) => {
    event.preventDefault()

    const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login'
    const body =
      authMode === 'register'
        ? authForm
        : { email: authForm.email, password: authForm.password }

    const data = await requestJson(
      endpoint,
      { method: 'POST', body: JSON.stringify(body) },
      null,
    )
    const addresses = normalizeAddresses(data.user)

    localStorage.setItem('cafe67_token', data.token)
    setUser(data.user)
    setOrders([])
    setAccountView('dashboard')
    setProfileForm({
      name: data.user.name || '',
      phone: data.user.phone || '',
    })
    setUserAddresses(addresses)
    setSelectedCheckoutAddressId(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || 'local-0')
    setCheckoutForm((current) => ({
      ...current,
      customer_name: current.customer_name || data.user.name || '',
      customer_phone: current.customer_phone || addresses.find((address) => address.is_default)?.phone || data.user.phone || '',
      delivery_address: current.delivery_address || formatAddress(addresses.find((address) => address.is_default) || addresses[0]) || '',
    }))
    setToken(data.token)
    setNotice(createNotice(
      authMode === 'register'
        ? t('accountCreated')
        : t('loggedIn'),
      'success',
    ))
    await hydrateAccount(data.token)
  }

  const sendResetLink = async (event) => {
    event.preventDefault()

    const data = await requestJson(
      '/auth/forgot-password',
      { method: 'POST', body: JSON.stringify(forgotForm) },
      null,
    )
    setNotice(createNotice(t('otpSent'), 'success'))
    setResetForm((current) => ({ ...current, email: forgotForm.email }))
    setResendAvailableAt(Date.now() + (data.resend_after_seconds || 120) * 1000)
    setResendNow(Date.now())
    setAuthMode('reset')
  }

  const resendOtp = async () => {
    if (!canResendOtp) {
      return
    }

    const email = resetForm.email || forgotForm.email
    const data = await requestJson(
      '/auth/forgot-password',
      { method: 'POST', body: JSON.stringify({ email }) },
      null,
    )

    setForgotForm({ email })
    setResetForm((current) => ({ ...current, email }))
    setNotice(createNotice(t('otpSent'), 'success'))
    setResendAvailableAt(Date.now() + (data.resend_after_seconds || 120) * 1000)
    setResendNow(Date.now())
  }

  const resetPassword = async (event) => {
    event.preventDefault()

    const data = await requestJson(
      '/auth/reset-password',
      { method: 'POST', body: JSON.stringify(resetForm) },
      null,
    )
    setNotice(createNotice(t('passwordReset'), 'success'))
    setResetForm({ email: '', otp: '', password: '', password_confirmation: '' })
    setResendAvailableAt(null)
    setAuthMode('login')
  }

  const updateProfile = async (event) => {
    event.preventDefault()

    const hasDefaultAddress = userAddresses.some((address) => address.is_default)
    const addresses = userAddresses.map((address, index) => ({
      ...address,
      is_default: hasDefaultAddress ? address.is_default : index === 0,
    }))

    const data = await requestJson(
      '/auth/profile',
      {
        method: 'PATCH',
        body: JSON.stringify({ ...profileForm, addresses }),
      },
      token,
    )

    const savedAddresses = normalizeAddresses(data.user)

    setUser(data.user)
    setUserAddresses(savedAddresses)
    setCheckoutForm((current) => ({
      ...current,
      customer_name: data.user.name || current.customer_name,
      customer_phone: savedAddresses.find((address) => address.is_default)?.phone || data.user.phone || current.customer_phone,
      delivery_address: formatAddress(savedAddresses.find((address) => address.is_default) || savedAddresses[0]) || current.delivery_address,
    }))
    setNotice(createNotice(t('profileUpdated'), 'success'))
  }

  const openAccountView = (nextView, event) => {
    if (event) {
      openPage('/account', event)
    }

    setAccountView(nextView)
  }

  const updateAddress = (index, field, value) => {
    setUserAddresses((current) => current.map((address, addressIndex) => (
      addressIndex === index ? { ...address, [field]: value } : address
    )))
  }

  const addAddress = () => {
    setUserAddresses((current) => [
      ...current,
      { ...emptyAddress, is_default: current.length === 0 },
    ])
  }

  const removeAddress = (index) => {
    setUserAddresses((current) => {
      const nextAddresses = current.filter((_, addressIndex) => addressIndex !== index)

      if (nextAddresses.length === 0) {
        return [{ ...emptyAddress, is_default: true }]
      }

      if (!nextAddresses.some((address) => address.is_default)) {
        return nextAddresses.map((address, addressIndex) => ({
          ...address,
          is_default: addressIndex === 0,
        }))
      }

      return nextAddresses
    })
  }

  const setDefaultAddress = (index) => {
    setUserAddresses((current) => current.map((address, addressIndex) => ({
      ...address,
      is_default: addressIndex === index,
    })))
  }

  const applyCheckoutAddress = (address, addressKey) => {
    setSelectedCheckoutAddressId(addressKey)
    setCheckoutForm((current) => ({
      ...current,
      customer_phone: address.phone || current.customer_phone,
      delivery_address: formatAddress(address) || current.delivery_address,
    }))
  }

  const logout = async () => {
    await requestJson('/auth/logout', { method: 'POST' }, token).catch(
      () => null,
    )
    localStorage.removeItem('cafe67_token')
    setToken(null)
    setUser(null)
    setOrders([])
    setProfileForm({ name: '', phone: '' })
    setUserAddresses([{ ...emptyAddress, is_default: true }])
    setSelectedCheckoutAddressId(null)
    setAccountView('dashboard')
    setNotice(createNotice(t('loggedOut'), 'success'))
  }

  const buildOrderBody = () => {
    const mobileNumber = normalizePhoneForLoyalty(checkoutForm.customer_phone)

    return {
      customer_name: checkoutForm.customer_name || null,
      mobile_number: mobileNumber,
      cup_type: checkoutForm.cup_type || 'carton',
      car_model: checkoutForm.car_type || null,
      car_number: checkoutForm.car_number || null,
      customer_notes: checkoutForm.customer_notes || null,
      use_free_cup: Boolean(checkoutForm.use_free_cup),
      free_cups_to_use: checkoutForm.use_free_cup
        ? (checkoutForm.free_cups_to_use ? Number(checkoutForm.free_cups_to_use) : null)
        : null,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    }
  }

  const validateOrderRequest = () => {
    if (!isDailyLimitReady || soldOut) {
      setNotice(createNotice(t('soldOutTitle'), 'error'))
      return false
    }

    if (cartItems.length === 0) {
      setNotice(createNotice(t('cartEmpty'), 'error'))
      return false
    }

    if (cartCups > dailyLimit.remaining_cups) {
      setNotice(createNotice(t('cupsNotEnough'), 'error'))
      return false
    }

    const mobileNumber = normalizePhoneForLoyalty(checkoutForm.customer_phone)

    if (!mobileNumber) {
      setNotice(createNotice(t('mobileRequired'), 'error'))
      return false
    }

    return true
  }

  const finishOrderSuccess = async (data) => {
    setCart([])
    setOrderModalOpen(false)
    setModalPendingOrder(null)
    setCatalog((current) => ({ ...current, daily_limit: data.daily_limit }))
    setNotice(createNotice(t('orderPlaced'), 'success'))
    setCheckoutForm((current) => ({
      ...current,
      cup_type: 'carton',
      use_free_cup: false,
      free_cups_to_use: '',
    }))

    if (token) {
      await hydrateAccount(token)
    }

    openPage('/')
  }

  const waitForPaidOrder = async (orderId, mobileNumber) => {
    const query = mobileNumber
      ? `?mobile_number=${encodeURIComponent(mobileNumber)}`
      : ''

    // Guest payment endpoints verify by phone. Avoid sending a stale Bearer token
    // that can cause "not authorized" even when the phone matches the order.
    const paymentAuthToken = mobileNumber ? null : token

    for (let attempt = 0; attempt < 15; attempt += 1) {
      const data = await requestJson(
        `/orders/${orderId}/payment-status${query}`,
        {},
        paymentAuthToken,
      )

      if (data.payment_status === 'paid') {
        return data
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 2000)
      })
    }

    throw new Error(t('paymentProcessingFail'))
  }

  useEffect(() => {
    if (path !== '/checkout/complete') {
      return undefined
    }

    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    const pending = readPendingCheckout()

    if (!sessionId) {
      setNotice(createNotice(t('checkoutSessionMissing'), 'error'))
      openPage('/')
      return undefined
    }

    if (!pending?.orderId) {
      setNotice(createNotice(t('checkoutSessionMissing'), 'error'))
      openPage('/')
      return undefined
    }

    let active = true

    ;(async () => {
      try {
        await waitForPaidOrder(pending.orderId, pending.mobileNumber)

        if (!active) {
          return
        }

        clearPendingCheckout()

        if (pending.checkoutData) {
          await finishOrderSuccess(pending.checkoutData)
          return
        }

        setNotice(createNotice(t('orderPlaced'), 'success'))
        openPage('/')
      } catch (error) {
        if (!active) {
          return
        }

        setNotice(createNotice(getFirstErrorMessage(error, t('paymentProcessingFail')), 'error'))
        openPage('/')
      }
    })()

    return () => {
      active = false
    }
  }, [path])

  const createPendingOrder = async () => {
    if (!validateOrderRequest()) {
      return null
    }

    return requestJson(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify(buildOrderBody()),
      },
      token,
    )
  }

  const handleOrderComplete = async (data) => {
    await finishOrderSuccess(data)
  }

  const handlePaymentSuccess = async (data) => {
    const mobileNumber = data.order?.mobile_number
      || normalizePhoneForLoyalty(checkoutForm.customer_phone)

    try {
      await waitForPaidOrder(data.order.id, mobileNumber)
      await finishOrderSuccess(data)
    } catch (error) {
      setNotice(createNotice(getFirstErrorMessage(error, t('paymentProcessingFail')), 'error'))
      throw error
    }
  }

  const submitOrder = async (event) => {
    event?.preventDefault?.()

    let data

    try {
      data = await createPendingOrder()
    } catch (error) {
      setNotice(createNotice(getFirstErrorMessage(error, t('placeOrderFail')), 'error'))
      return
    }

    if (!data) {
      return
    }

    if (!data.payment) {
      await finishOrderSuccess(data)
      return
    }

    setModalPendingOrder(data)
    setOrderModalInitialStep(3)
    setOrderModalOpen(true)
  }

  const renderHomeContent = () => (
    <section
      className="home-showcase-card"
      style={{
        '--hero-color-a': activeHeroSlide.colorA,
        '--hero-color-b': activeHeroSlide.colorB,
        '--hero-color-c': activeHeroSlide.colorC,
      }}
    >
      <div className="home-showcase-slide">
        <div className="home-showcase-copy">
          <div className="home-showcase-brand">
            <img className="home-showcase-hero-logo" src={homeHeroLogo} alt={settings.cafe_name || 'Cafe 67'} />
            {/* <span>{settings.cafe_name || 'Cafe 67'}</span> */}
          </div>

          <HeroIconMarquee
            items={marqueeItems}
            ariaLabel={t('cafeHighlights')}
            itemKeyPrefix="top-"
          />

          <div className="daily-count-display" aria-label={t('dailyCupProgress')}>
            <span>{isDailyLimitReady && soldOut ? t('cupsSoldOutToday') : t('cupsServedToday')}</span>
            <strong aria-busy={!isDailyLimitReady}>
              {isDailyLimitReady ? (
                soldOut ? `${cupLimit}/${cupLimit}` : `${orderedCount}/${cupLimit}`
              ) : (
                <span
                  className="daily-count-loader order-payment-spinner"
                  role="status"
                  aria-label={t('dailyCupProgress')}
                />
              )}
            </strong>
          </div>

          <div className="hero-cta-row">
            <button
              className="hero-primary-button"
              type="button"
              disabled={isOrderingDisabled}
              onClick={() => openOrderModal(1)}
            >
              {soldOut ? (
                <span className="hero-primary-button-copy">
                  <span>{t('soldOutTitle')}</span>
                  <small>{t('soldOutTomorrow')}</small>
                </span>
              ) : t('orderNow')}
            </button>
          </div>

          <HeroIconMarquee
            items={marqueeItems}
            className="marquee__wrapper--reverse"
            ariaLabel={t('cafeHighlightsCta')}
            itemKeyPrefix="bottom-"
          />


        </div>

      </div>
      <div className="home-showcase-footer">
        <div className="hero-social" aria-label={isArabic ? 'روابط التواصل الاجتماعي' : 'Social media links'}>
          <a href={socialLinks.call} aria-label={isArabic ? 'اتصال' : 'Call'}>
            <PhoneCall />
          </a>
          <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href={socialLinks.location} target="_blank" rel="noreferrer" aria-label={isArabic ? 'لوكيشن' : 'Location'}>
            <MapPin />
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()} {settings.cafe_name || 'Cafe 67'}. {t('allRightsReserved')}
        </p>
      </div>

    </section>
  )

  const renderMenuSections = () => (
    <div className="page-sections menu-page-sections">
      <section className="section-shell menu-shop-shell">
        <div className="shop-grid" aria-label={t('shopMenu')}>
          {isCatalogLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <article className="shop-card skeleton-card" key={`skeleton-${index}`} aria-hidden="true">
                <div className="skeleton-media shimmer" />
                <div className="skeleton-content">
                  <span className="shimmer skeleton-line short" />
                  <span className="shimmer skeleton-line medium" />
                  <span className="shimmer skeleton-line long" />
                  <span className="shimmer skeleton-line long" />
                  <span className="shimmer skeleton-line short" />
                </div>
              </article>
            ))
            : products.map((product, index) => (
              <article className="shop-card" key={product.id}>
                <img
                  src={getProductImageUrl(product, fallbackImages[index % fallbackImages.length])}
                  alt={product.name}
                />
                <div>
                  <span>{product.category?.name || t('drink')}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="shop-card-footer">
                    <strong>{money(product.price, locale)}</strong>
                    <button
                      type="button"
                      disabled={isOrderingDisabled || !product.is_available}
                      onClick={() => addToCart(product)}
                    >
                      {t('addToCart')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
        {!isCatalogLoading && products.length === 0 ? (
          <p className="empty-menu-copy">{t('noProductsYet')}</p>
        ) : null}
      </section>
    </div>
  )

  const renderAboutSections = () => (
    <div className="page-sections">
      <section className="section-card-grid">
        <article>
          <strong>{isArabic ? 'حد يومي صغير' : 'Small daily limit'}</strong>
          <span>{isArabic ? 'عدد 99 كوب يخلي التجربة مرتبة وسريعة وطازجة.' : '99 cups keeps the experience controlled, fast, and fresh.'}</span>
        </article>
        <article>
          <strong>{isArabic ? 'تشغيل احترافي' : 'Premium workflow'}</strong>
          <span>
            {isArabic
              ? 'المنتجات والطلبات والبنر والحد اليومي كلها متزامنة مع نظام Laravel الخلفي.'
              : 'Products, orders, banners, and daily limits stay synced with the Laravel backend.'}
          </span>
        </article>
        <article>
          <strong>{isArabic ? 'ضيافة دافئة' : 'Warm hospitality'}</strong>
          <span>
            {isArabic
              ? 'التصميم مقصود وفخم وسهل للطلب سواء من الجوال أو الكمبيوتر.'
              : 'Designed to feel intentional, premium, and easy to order from mobile or desktop.'}
          </span>
        </article>
      </section>
      <section className="wide-story-card">
        <div>
          <p>{isArabic ? 'ليش يضبط؟' : 'Why it works'}</p>
          <h2>{isArabic ? 'كل طلب يلتزم بالحد اليومي للخدمة' : 'Every order respects the daily service limit'}</h2>
        </div>
        <span>
          {isArabic
            ? 'واجهة الطلب تحافظ على تجربة مركزة للعميل، مع ربط مباشر بين المنيو وإتمام الطلب والحساب ونظام Laravel.'
            : 'The storefront keeps the customer experience focused, while the menu, checkout, and account flows stay directly connected to the Laravel backend.'}
        </span>
      </section>
    </div>
  )

  const renderContactSections = () => (
    <div className="page-sections">
      <section className="section-card-grid">
        <article>
          <strong>{t('phone')}</strong>
          <span>{settings.phone || '+1 555 670 067'}</span>
        </article>
        <article>
          <strong>{isArabic ? 'واتساب' : 'WhatsApp'}</strong>
          <span>{settings.whatsapp || '+1 555 670 067'}</span>
        </article>
        <article>
          <strong>{isArabic ? 'الساعات' : 'Hours'}</strong>
          <span>
            {shortTime(settings.opens_at)} - {shortTime(settings.closes_at || '21:00')}
          </span>
        </article>
      </section>
      <section className="wide-story-card contact-story-card">
        <div>
          <p>{isArabic ? 'تحتاج مساعدة؟' : 'Need help?'}</p>
          <h2>{isArabic ? 'دعم الطلبات بسهولة' : 'Order support without friction'}</h2>
        </div>
        <span>
          {isArabic
            ? 'تواصل مع فريق الكافيه لتأكيد العنوان أو معرفة توفر اليوم أو الطلبات الخاصة قبل ما يوصل حد اليوم.'
            : 'Contact the cafe team for address clarification, daily availability, or special ordering requests before the cup limit closes for the day.'}
        </span>
      </section>
    </div>
  )

  const renderCheckoutSections = () => (
    <div className="page-sections checkout-sections">
      <section className="checkout-items-panel">
        <div className="section-heading left">
          <p>{t('cartItems')}</p>
          <h2>{t('reviewDrinks')}</h2>
        </div>
        {cartItems.length === 0 ? (
          <p className="muted-copy">{t('noItemsStartFromMenu')}</p>
        ) : (
          cartItems.map((item) => (
            <article className="checkout-line" key={item.product_id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{money(item.product.price, locale)} {t('each')}</span>
              </div>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
                <button type="button" onClick={() => setQuantity(item.product_id, 0)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))
        )}
        <div className="checkout-summary-bar">
          <span>{cartCups} {t('cups')}</span>
          <strong>{money(cartTotal, locale)}</strong>
        </div>
      </section>

      <form className="checkout-form" onSubmit={submitOrder}>
        <div className="section-heading left">
          <p>{t('deliveryDetails')}</p>
          <h2>{t('deliveryInformation')}</h2>
        </div>
        <label>
          {t('fullName')}
          <input
            required
            value={checkoutForm.customer_name}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, customer_name: event.target.value })
            }
          />
        </label>
        <label>
          {t('phoneNumber')}
          <PhoneInput
            country="ae"
            countryCodeEditable
            placeholder="+971 50 123 4567"
            containerClass="phone-field"
            inputClass="phone-field-input"
            buttonClass="phone-field-flag"
            value={normalizePhoneForInput(checkoutForm.customer_phone)}
            onChange={(value) => {
              const normalizedValue = normalizePhoneForStorage(value)
              setCheckoutForm((current) => (
                current.customer_phone === normalizedValue
                  ? current
                  : { ...current, customer_phone: normalizedValue }
              ))
            }}
          />
        </label>
        {!isCheckoutPhoneValid && checkoutForm.customer_phone ? (
          <p className="field-hint error">{t('enterValidPhone')}</p>
        ) : null}
        <label>
          {t('carNumber')}
          <input
            required
            value={checkoutForm.car_number}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, car_number: event.target.value })
            }
          />
        </label>
        <label>
          {t('notes')}
          <textarea
            value={checkoutForm.customer_notes}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, customer_notes: event.target.value })
            }
          />
        </label>
        <button type="submit" disabled={cartItems.length === 0 || isOrderingDisabled || !isCheckoutPhoneValid}>
          {t('placeOrder')}
        </button>
      </form>
    </div>
  )

  const renderDashboardTiles = () => {
    const tiles = [
      {
        key: 'orders',
        title: isArabic ? 'الطلبات' : 'Orders',
        description: orders.length > 0
          ? (isArabic ? `${orders.length} طلبات حديثة` : `${orders.length} recent orders`)
          : (isArabic ? 'تابع آخر طلباتك من الكافيه' : 'Track your latest cafe orders'),
      },
      {
        key: 'addresses',
        title: isArabic ? 'العناوين' : 'Addresses',
        description: isArabic
          ? `${userAddresses.length} عنوان محفوظ`
          : `${userAddresses.length} saved address${userAddresses.length === 1 ? '' : 'es'}`,
      },
      {
        key: 'details',
        title: isArabic ? 'تفاصيل الحساب' : 'Account details',
        description: isArabic
          ? 'عدّل اسمك ورقم الجوال الأساسي'
          : 'Edit your profile name and main phone number',
      },
      {
        key: 'logout',
        title: isArabic ? 'تسجيل خروج' : 'Logout',
        description: isArabic ? 'تسجيل الخروج من حساب Cafe 67' : 'Sign out from your Cafe 67 account',
      },
    ]

    return (
      <div className="account-dashboard-tiles">
        {tiles.map((tile) => (
          <button
            key={tile.key}
            type="button"
            className="account-dashboard-tile"
            onClick={tile.key === 'logout' ? logout : (event) => openAccountView(tile.key, event)}
          >
            <strong>{tile.title}</strong>
            <span>{tile.description}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderAccountDetailsView = () => (
    <form className="account-form account-dashboard-form" onSubmit={updateProfile}>
      <div className="account-dashboard-section-header">
        <div>
          <p>{isArabic ? 'تفاصيل الحساب' : 'Account details'}</p>
          <h3>{isArabic ? 'عدّل بيانات ملفك الأساسي' : 'Edit your main profile details'}</h3>
        </div>
      </div>
      <div className="profile-details-grid">
        <label>
          {t('name')}
          <input
            required
            value={profileForm.name}
            onChange={(event) =>
              setProfileForm({ ...profileForm, name: event.target.value })
            }
          />
        </label>
        <label>
          {isArabic ? 'جوال الحساب' : 'Account phone'}
          <input
            value={profileForm.phone}
            onChange={(event) =>
              setProfileForm({ ...profileForm, phone: event.target.value })
            }
          />
        </label>
      </div>
      <div className="account-actions-row">
        <button type="submit">{isArabic ? 'حفظ تفاصيل الحساب' : 'Save account details'}</button>
      </div>
    </form>
  )

  const renderAddressesView = () => (
    <form className="account-form account-dashboard-form" onSubmit={updateProfile}>
      <div className="address-manager-header account-dashboard-section-header">
        <div>
          <p>{isArabic ? 'العناوين' : 'Addresses'}</p>
          <strong>{isArabic ? `${userAddresses.length} عنوان محفوظ` : `${userAddresses.length} saved address${userAddresses.length === 1 ? '' : 'es'}`}</strong>
        </div>
        <button type="button" className="ghost-button compact" onClick={addAddress}>
          {isArabic ? 'إضافة عنوان' : 'Add address'}
        </button>
      </div>

      <div className="address-card-grid">
        {userAddresses.map((address, index) => (
          <article className="address-edit-card" key={address.id || `address-${index}`}>
            <div className="address-edit-card-header">
              <strong>{isArabic ? `العنوان ${index + 1}` : `Address ${index + 1}`}</strong>
              <div>
                <button
                  type="button"
                  className={address.is_default ? 'address-pill active' : 'address-pill'}
                  onClick={() => setDefaultAddress(index)}
                >
                  {address.is_default ? (isArabic ? 'افتراضي' : 'Default') : (isArabic ? 'تعيين كافتراضي' : 'Set default')}
                </button>
                <button type="button" className="address-remove" onClick={() => removeAddress(index)}>
                  {isArabic ? 'حذف' : 'Remove'}
                </button>
              </div>
            </div>
            <div className="address-fields-grid">
              <label>
                {t('phone')}
                <input
                  required
                  value={address.phone}
                  onChange={(event) => updateAddress(index, 'phone', event.target.value)}
                />
              </label>
              <label>
                {t('townCity')}
                <input
                  required
                  value={address.town_city}
                  onChange={(event) => updateAddress(index, 'town_city', event.target.value)}
                />
              </label>
              <label>
                {t('address')}
                <textarea
                  required
                  value={address.address}
                  onChange={(event) => updateAddress(index, 'address', event.target.value)}
                />
              </label>
              <label>
                {t('villaFloor')}
                <input
                  required
                  value={address.villa_floor}
                  onChange={(event) => updateAddress(index, 'villa_floor', event.target.value)}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
      <div className="account-actions-row">
        <button type="submit">{isArabic ? 'حفظ العناوين' : 'Save addresses'}</button>
      </div>
    </form>
  )

  const renderOrdersView = () => (
    <section className="account-dashboard-block orders-dashboard-block">
      <div className="account-dashboard-section-header">
        <div>
          <p>{isArabic ? 'الطلبات' : 'Orders'}</p>
          <h3>{isArabic ? 'طلبات العميل الأخيرة' : 'Recent customer orders'}</h3>
        </div>
      </div>
      {orders.length === 0 ? (
        <p className="muted-copy">
          {isArabic ? 'ما فيه طلبات للحين. اطلب من المنيو أول طلب لك.' : 'No orders yet. Shop the menu to place your first order.'}
        </p>
      ) : null}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div>
            <strong>{order.order_number}</strong>
            <span>
              {order.items.length} {isArabic ? 'عناصر' : 'lines'} · {money(order.total, locale)}
            </span>
          </div>
          <em>{order.status.replaceAll('_', ' ')}</em>
        </article>
      ))}
    </section>
  )

  const renderDashboardView = () => (
    <section className="account-dashboard-block account-dashboard-home">
      <div className="account-dashboard-welcome">
        <p>{isArabic ? 'هلا' : 'Hello'} <strong>{user?.name || settings.cafe_name || 'Cafe 67'}</strong></p>
        <span>
          {isArabic
            ? 'من لوحة الحساب تقدر تشوف طلباتك الأخيرة، تدير عناوينك المحفوظة، وتعدّل تفاصيل حسابك.'
            : 'From your account dashboard you can view your recent orders, manage your saved addresses, and edit your account details.'}
        </span>
      </div>
      {renderDashboardTiles()}
    </section>
  )

  const renderAccountContent = () => {
    if (accountView === 'orders') {
      return renderOrdersView()
    }

    if (accountView === 'addresses') {
      return renderAddressesView()
    }

    if (accountView === 'details') {
      return renderAccountDetailsView()
    }

    return renderDashboardView()
  }

  const renderAccountSections = () => (
    <div className={user ? 'page-sections account-sections is-logged-in' : 'page-sections account-sections'}>
      {user ? (
        <section className="account-dashboard-shell">
          <aside className="account-dashboard-sidebar">
            <div className="account-dashboard-user">
              <div className="account-avatar">{(user.name || 'C').slice(0, 1).toUpperCase()}</div>
              <div>
                <strong>{user.name}</strong>
                <span>{isArabic ? 'عميل' : 'Customer'} #{String(user.id || '').padStart(4, '0')}</span>
              </div>
            </div>

            <div className="account-dashboard-menu">
              <button
                type="button"
                className={accountView === 'dashboard' ? 'active' : ''}
                onClick={() => setAccountView('dashboard')}
              >
                {isArabic ? 'لوحة التحكم' : 'Dashboard'}
              </button>
              <button
                type="button"
                className={accountView === 'orders' ? 'active' : ''}
                onClick={() => setAccountView('orders')}
              >
                {isArabic ? 'الطلبات' : 'Orders'}
              </button>
              <button
                type="button"
                className={accountView === 'addresses' ? 'active' : ''}
                onClick={() => setAccountView('addresses')}
              >
                {isArabic ? 'العناوين' : 'Addresses'}
              </button>
              <button
                type="button"
                className={accountView === 'details' ? 'active' : ''}
                onClick={() => setAccountView('details')}
              >
                {isArabic ? 'تفاصيل الحساب' : 'Account details'}
              </button>
              <button type="button" onClick={logout}>{isArabic ? 'تسجيل خروج' : 'Logout'}</button>
            </div>
          </aside>

          <div className="account-dashboard-main">
            {renderAccountContent()}
          </div>
        </section>
      ) : (
        <section className="account-auth-layout">
          <article className="account-auth-intro">
            <p className="account-auth-kicker">{t('memberAccess')}</p>
            <h2 className="account-auth-title">
              {t('welcomeBackTo')} <span>{settings.cafe_name || 'Cafe 67'}</span>
            </h2>
            <p className="account-auth-copy">
              {t('signInHelp')}
            </p>
            <ul className="account-benefits">
              <li>{t('benefitOne')}</li>
              <li>{t('benefitTwo')}</li>
              <li>{t('benefitThree')}</li>
            </ul>
          </article>

          <section className="account-auth-card">
            <div className="account-auth-header">
              <h3>
                {authMode === 'login' ? t('signIn') : null}
                {authMode === 'register' ? t('createAccount') : null}
                {authMode === 'forgot' ? t('forgotPassword') : null}
                {authMode === 'reset' ? t('resetPassword') : null}
              </h3>
              <p>
                {authMode === 'login' ? t('loginHelp') : null}
                {authMode === 'register' ? t('registerHelp') : null}
                {authMode === 'forgot' ? t('forgotHelp') : null}
                {authMode === 'reset' ? t('resetHelp') : null}
              </p>
            </div>

            {(authMode === 'login' || authMode === 'register') && (
              <form className="account-auth-form" onSubmit={submitAuth}>
                {authMode === 'register' ? (
                  <>
                    <label>
                      {t('name')}
                      <input
                        required
                        value={authForm.name}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, name: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t('phone')}
                      <input
                        value={authForm.phone}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, phone: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t('townCity')}
                      <input
                        value={authForm.town_city}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, town_city: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t('address')}
                      <textarea
                        value={authForm.address}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, address: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t('villaFloor')}
                      <input
                        value={authForm.villa_floor}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, villa_floor: event.target.value })
                        }
                      />
                    </label>
                  </>
                ) : null}
                <label>
                  {t('email')}
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t('password')}
                  <input
                    required
                    type="password"
                    minLength={8}
                    placeholder={t('enterPassword')}
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, password: event.target.value })
                    }
                  />
                </label>

                <div className="account-links-row">
                  {authMode === 'login' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('forgot')}>
                      {t('forgotPasswordQ')}
                    </button>
                  ) : null}
                  {authMode === 'login' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('register')}>
                      {t('createAccountQ')}
                    </button>
                  ) : null}
                  {authMode === 'register' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('login')}>
                      {t('backToSignIn')}
                    </button>
                  ) : null}
                </div>

                <button type="submit">
                  {authMode === 'register' ? t('createAccount') : t('login')}
                </button>
              </form>
            )}

            {authMode === 'forgot' ? (
              <form className="account-auth-form" onSubmit={sendResetLink}>
                <label>
                  {t('email')}
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={forgotForm.email}
                    onChange={(event) => setForgotForm({ email: event.target.value })}
                  />
                </label>

                <div className="account-links-row">
                  <button type="button" className="account-link-action" onClick={() => setAuthMode('login')}>
                    {t('backToSignIn')}
                  </button>
                </div>

                <button type="submit">{t('sendOtp')}</button>
              </form>
            ) : null}

            {authMode === 'reset' ? (
              <form className="account-auth-form" onSubmit={resetPassword}>
                <label>
                  {t('email')}
                  <input
                    required
                    type="email"
                    value={resetForm.email}
                    onChange={(event) =>
                      setResetForm({ ...resetForm, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t('otpCode')}
                  <input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t('otpPlaceholder')}
                    value={resetForm.otp}
                    onChange={(event) =>
                      setResetForm({ ...resetForm, otp: event.target.value.replace(/\D/g, '').slice(0, 6) })
                    }
                  />
                </label>
                <label>
                  {t('newPassword')}
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={resetForm.password}
                    onChange={(event) =>
                      setResetForm({ ...resetForm, password: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t('confirmPassword')}
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={resetForm.password_confirmation}
                    onChange={(event) =>
                      setResetForm({
                        ...resetForm,
                        password_confirmation: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="account-links-row">
                  <button type="button" className="account-link-action" onClick={() => setAuthMode('login')}>
                    {t('backToSignIn')}
                  </button>
                  <button
                    type="button"
                    className="account-link-action"
                    disabled={!canResendOtp}
                    onClick={resendOtp}
                  >
                    {canResendOtp ? t('resendOtp') : `${t('resendIn')} ${resendRemainingSeconds}s`}
                  </button>
                </div>

                <button type="submit">{t('resetPassword')}</button>
              </form>
            ) : null}

            {authMode === 'forgot' ? (
              <button
                type="button"
                className="account-link-action standalone"
                onClick={() => setAuthMode('reset')}
              >
                {t('alreadyHaveOtp')}
              </button>
            ) : null}
          </section>
        </section>
      )}
    </div>
  )

  const renderPageSections = () => {
    if (path === '/checkout/complete') {
      return (
        <CheckoutComplete
          title={t('completingPayment')}
          body={t('completingPaymentBody')}
        />
      )
    }
    if (activePage.path === '/menu') {
      return renderMenuSections()
    }
    if (activePage.path === '/about-us') {
      return renderAboutSections()
    }
    if (activePage.path === '/contact-us') {
      return renderContactSections()
    }
    if (activePage.path === '/checkout') {
      return renderCheckoutSections()
    }
    return null
  }

  const renderHeroSurface = () => {
    if (path === '/checkout/complete') {
      return null
    }
    if (activePage.path === '/') {
      return (
        <section className="hero-surface home-hero home-showcase-surface">
          <div className="hero-inner home-hero-inner">
            <div className="hero-home-actions">
              <header className={`site-nav home-site-nav ${scrolled ? 'is-scrolled' : ''}`}>
                <nav aria-label={t('mainNavigation')}>
                  {navPages.map((page) => (
                    <a
                      key={page.path}
                      href={page.path}
                      className={page.path === activePage.path ? 'active' : ''}
                      onClick={(event) => openPage(page.path, event)}
                    >
                      {page.label}
                    </a>
                  ))}
                </nav>

                <div className="nav-actions">
                  <button
                    className="icon-link"
                    type="button"
                    onClick={() => setLanguage((current) => (current === 'en' ? 'ar' : 'en'))}
                    aria-label={isArabic ? 'Switch to English' : 'التحويل للعربية'}
                    title={isArabic ? 'Switch to English' : 'التحويل للعربية'}
                  >
                    {isArabic ? 'EN' : 'AR'}
                  </button>
                  <button
                    className="menu-button"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(true)
                      setCartOpen(false)
                    }}
                    aria-label={t('openMenu')}
                  >
                    <Menu size={18} />
                  </button>
                  <button
                    className="cart-button"
                    type="button"
                    onClick={() => {
                      setCartOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    aria-label={t('openCart')}
                  >
                    <ShoppingBag size={18} />
                    <span>{cartCups}</span>
                  </button>
                </div>
              </header>

              {renderHomeContent()}
            </div>
          </div>
        </section>
      )
    }

    return (
      <section
        className="hero-surface inner-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 12, 10, 0.66), rgba(10, 12, 10, 0.42)), url(${banner.background_image_url || fallbackHero})`,
        }}
      >
        <div className="hero-inner">
          <p className="hero-kicker">{activePage.kicker}</p>
          <h1>{activePage.title}</h1>
          <p className="hero-subtitle">{activePage.subtitle}</p>
        </div>
      </section>
    )
  }

  return (
    <main className={`site-shell route-${path === '/checkout/complete' ? 'checkout-complete' : activePage.path === '/' ? 'home' : activePage.path.slice(1).replaceAll('/', '-')}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {path !== '/' && path !== '/checkout/complete' ? (
        <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
          <nav aria-label={t('mainNavigation')}>
            {navPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                className={page.path === activePage.path ? 'active' : ''}
                onClick={(event) => openPage(page.path, event)}
              >
                {page.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="icon-link"
              type="button"
              onClick={() => setLanguage((current) => (current === 'en' ? 'ar' : 'en'))}
              aria-label={isArabic ? 'Switch to English' : 'التحويل للعربية'}
              title={isArabic ? 'Switch to English' : 'التحويل للعربية'}
            >
              {isArabic ? 'EN' : 'AR'}
            </button>
            <button
              className="menu-button"
              type="button"
              onClick={() => {
                setMobileMenuOpen(true)
                setCartOpen(false)
              }}
              aria-label={t('openMenu')}
            >
              <Menu size={18} />
            </button>
            <button
              className="cart-button"
              type="button"
              onClick={() => {
                setCartOpen(true)
                setMobileMenuOpen(false)
              }}
              aria-label={t('openCart')}
            >
              <ShoppingBag size={18} />
              <span>{cartCups}</span>
            </button>
          </div>
        </header>
      ) : null}

      {notice ? (
        <div className={`notice notice--${notice.tone}`} role="status" aria-live="polite">
          <div className="notice-icon" aria-hidden="true">
            {notice.tone === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <div className="notice-body">
            <strong>{notice.tone === 'error' ? t('noticeTitleError') : t('noticeTitleSuccess')}</strong>
            <span>{notice.message}</span>
          </div>
          <button className="notice-dismiss" type="button" onClick={() => setNotice(null)} aria-label={t('dismissNotification')}>
            <X size={16} />
          </button>
        </div>
      ) : null}

      {renderHeroSurface()}

      {renderPageSections()}

      <OrderNowModal
        isOpen={orderModalOpen}
        onClose={closeOrderModal}
        initialStep={orderModalInitialStep}
        products={orderModalProducts}
        isCatalogLoading={isCatalogLoading}
        fallbackImages={fallbackImages}
        cartItems={cartItems}
        cartCups={cartCups}
        cartTotal={cartTotal}
        orderedCount={orderedCount}
        cupLimit={cupLimit}
        soldOut={isOrderingDisabled}
        money={(value) => money(value, locale)}
        addToCart={addToCart}
        setQuantity={setQuantity}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        isCheckoutPhoneValid={isCheckoutPhoneValid}
        loyaltyState={loyaltyState}
        userAddresses={userAddresses}
        selectedCheckoutAddressId={selectedCheckoutAddressId}
        applyCheckoutAddress={applyCheckoutAddress}
        user={user}
        paymentConfig={paymentConfig}
        pendingOrderData={modalPendingOrder}
        onCreatePendingOrder={createPendingOrder}
        onOrderComplete={handleOrderComplete}
        onPaymentSuccess={handlePaymentSuccess}
        language={language}
      />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label={isArabic ? 'سلة التسوق' : 'Shopping cart'}>
        <div className="cart-drawer-header">
          <strong>{t('yourCart')}</strong>
          <button type="button" onClick={() => setCartOpen(false)} aria-label={t('closeCart')}>
            <X size={18} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className="empty-cart">{t('noDrinksYet')}</p>
        ) : (
          cartItems.map((item) => (
            <article className="cart-line" key={item.product_id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{money(item.product.price, locale)} {t('each')}</span>
              </div>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
                <button type="button" onClick={() => setQuantity(item.product_id, 0)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </article>
          ))
        )}
        <div className="cart-total">
          <span>{cartCups} {t('cups')}</span>
          <strong>{money(cartTotal, locale)}</strong>
        </div>
        <button
          className="checkout-link"
          type="button"
          disabled={cartItems.length === 0 || isOrderingDisabled}
          onClick={() => openOrderModal(2)}
        >
          {t('goToCheckout')}
        </button>
      </aside>

      <aside className={`cart-drawer mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label={t('mobileMenu')}>
        <div className="cart-drawer-header">
          <strong>{t('menu')}</strong>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label={t('closeMenu')}>
            <X size={18} />
          </button>
        </div>

        <nav className="mobile-menu-links" aria-label={t('mobileNavigation')}>
          {navPages.map((page) => (
            <a
              key={page.path}
              href={page.path}
              className={page.path === activePage.path ? 'active' : ''}
              onClick={(event) => openPage(page.path, event)}
            >
              {page.label}
            </a>
          ))}
        </nav>
      </aside>
    </main>
  )
}

export default App

