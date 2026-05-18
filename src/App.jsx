import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bean,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CupSoda,
  IceCreamBowl,
  Menu,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Wheat,
  X,
} from 'lucide-react'
import { FaCookieBite, FaIceCream, FaMugHot } from 'react-icons/fa'
import { GiCoffeeBeans, GiCoffeeCup, GiCoffeePot,GiDonut, GiIceCube } from 'react-icons/gi'
import { LuCroissant } from "react-icons/lu";
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './App.css'

const PhoneInput = ReactPhoneInput?.default || ReactPhoneInput
import fallbackLogo from './assets/v67-logo.svg'
import OrderNowModal from './components/OrderNowModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
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

function normalizePath(pathname) {
  return pages.some((page) => page.path === pathname) ? pathname : '/'
}

function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))
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

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
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

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.5 9.5c.3-1 1-.9 1.3-.9h.4c.1 0 .3 0 .4.3l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3-.1.5.3.6.8 1.2 1.4 1.7.7.6 1.3 1 2.1 1.3.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.2.3.4v.4c0 .4.1 1-.8 1.3-.8.3-2.7.1-4.5-1.6-1.6-1.5-2.6-3.5-2.1-4.5Z" />
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

async function requestJson(url, options = {}, authToken = null) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || Object.values(data.errors || {})?.[0]?.[0] || 'Request failed.',
    )
  }

  return data
}

function App() {
  const [catalog, setCatalog] = useState(null)
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
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
  const [notice, setNotice] = useState('')
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
    car_type: '',
    car_number: '',
    delivery_address: '',
    customer_notes: '',
  })

  const hydrateAccount = async (authToken) => {
    const [me, history] = await Promise.all([
      requestJson(`${API_URL}/auth/me`, {}, authToken),
      requestJson(`${API_URL}/orders`, {}, authToken),
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

    requestJson(`${API_URL}/catalog`, {}, null)
      .then((data) => {
        if (active) {
          setCatalog(data)
        }
      })
      .catch((error) => {
        if (active) {
          setNotice(error.message)
        }
      })
      .finally(() => {
        if (active) {
          setIsCatalogLoading(false)
        }
      })

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
      requestJson(`${API_URL}/auth/me`, {}, token),
      requestJson(`${API_URL}/orders`, {}, token),
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

    const timeout = window.setTimeout(() => setNotice(''), 4000)

    return () => window.clearTimeout(timeout)
  }, [notice])

  const activePage = useMemo(
    () => pages.find((page) => page.path === path) || pages[0],
    [path],
  )
  const navPages = pages.filter((page) => page.path !== '/checkout')
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
      colorA: '#b8966d',
      colorB: '#9f7d56',
      colorC: '#f2c27b',
    }
  }, [activePage.subtitle, activePage.title, banner.background_image_url, banner.description, banner.title])
  const products = useMemo(() => {
    if (catalog?.products?.length) {
      return catalog.products
    }

    return isCatalogLoading ? [] : fallbackProducts
  }, [catalog, isCatalogLoading])
  const categories = useMemo(
    () => (catalog?.categories?.length ? catalog.categories : fallbackCategories),
    [catalog],
  )
  const dailyLimit = catalog?.daily_limit || {
    accepted_cups: 2,
    remaining_cups: 65,
    limit: 67,
    sold_out: false,
  }
  const soldOut = dailyLimit.sold_out
  const orderedCount = dailyLimit.accepted_cups || 2
  const cupLimit = dailyLimit.limit || 67
  const brandLogo = settings.logo_url || fallbackLogo
  const socialLinks = {
    facebook: settings.social_links?.facebook || '#',
    instagram: settings.social_links?.instagram || '#',
    whatsapp: settings.social_links?.whatsapp || normalizeWhatsAppLink(settings.whatsapp),
  }
  const marqueeItems = useMemo(
    () => [
      { id: 'coffee-cup', label: 'Coffee Cup', Icon: GiCoffeeCup },
      { id: 'coffee-steam', label: 'Coffee Steam', Icon: FaMugHot },
      { id: 'coffee-bean', label: 'Coffee Bean', Icon: GiCoffeeBeans },
      { id: 'espresso-shot', label: 'Espresso Shot', Icon: GiCoffeePot },
      { id: 'donut', label: 'Donut', Icon: GiDonut },
      { id: 'cookie', label: 'Cookie', Icon: FaCookieBite },
      { id: 'ice', label: 'Ice Cubes', Icon: GiIceCube },
      { id: 'icecream', label: 'Ice Cream', Icon: FaIceCream },
      { id: 'croissant', label: 'Croissant', Icon: LuCroissant },
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
    setOrderModalInitialStep(step)
    setCartOpen(false)
    setOrderModalOpen(true)
  }

  const closeOrderModal = () => {
    setOrderModalOpen(false)
  }

  const addToCart = (product) => {
    if (soldOut || !product.is_available) {
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
      `${API_URL}${endpoint}`,
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
    setNotice(
      authMode === 'register'
        ? 'Account created successfully.'
        : 'Logged in successfully.',
    )
    await hydrateAccount(data.token)
  }

  const sendResetLink = async (event) => {
    event.preventDefault()

    const data = await requestJson(
      `${API_URL}/auth/forgot-password`,
      { method: 'POST', body: JSON.stringify(forgotForm) },
      null,
    )
    setNotice(data.message || 'OTP sent to your email.')
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
      `${API_URL}/auth/forgot-password`,
      { method: 'POST', body: JSON.stringify({ email }) },
      null,
    )

    setForgotForm({ email })
    setResetForm((current) => ({ ...current, email }))
    setNotice(data.message || 'OTP sent to your email.')
    setResendAvailableAt(Date.now() + (data.resend_after_seconds || 120) * 1000)
    setResendNow(Date.now())
  }

  const resetPassword = async (event) => {
    event.preventDefault()

    const data = await requestJson(
      `${API_URL}/auth/reset-password`,
      { method: 'POST', body: JSON.stringify(resetForm) },
      null,
    )
    setNotice(data.message || 'Password has been reset.')
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
      `${API_URL}/auth/profile`,
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
    setNotice('Profile updated.')
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
    await requestJson(`${API_URL}/auth/logout`, { method: 'POST' }, token).catch(
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
    setNotice('Logged out.')
  }

  const submitOrder = async (event) => {
    event?.preventDefault?.()

    if (cartItems.length === 0) {
      setNotice('Your cart is empty.')
      return
    }

    if (cartCups > dailyLimit.remaining_cups) {
      setNotice('Not enough cups remain today for this cart.')
      return
    }

    const body = {
      customer_name: checkoutForm.customer_name,
      customer_phone: checkoutForm.customer_phone,
      car_number: [checkoutForm.car_type, checkoutForm.car_number].filter(Boolean).join(' - '),
      customer_notes: checkoutForm.customer_notes,
      items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    }

    const data = await requestJson(
      `${API_URL}/orders`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      token,
    )

    setCart([])
    setOrderModalOpen(false)
    setCatalog((current) => ({ ...current, daily_limit: data.daily_limit }))
    setNotice(
      `Order ${data.order.order_number} placed. ${data.daily_limit.remaining_cups} cups remain today.`,
    )
    if (token) {
      await hydrateAccount(token)
    }
    openPage('/')
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
            <img src={brandLogo} alt={settings.cafe_name || 'Cafe 67'} />
            {/* <span>{settings.cafe_name || 'Cafe 67'}</span> */}
          </div>

          <div className="marquee__wrapper" aria-label="Cafe highlights">
            <div className="marquee__content">
              <div className="marquee__repeated-items">
                {marqueeItems.map((item) => (
                  <div className="marquee__item" key={item.id}>
                    <item.Icon className="marquee__icon" />
                  </div>
                ))}
              </div>
            </div>
            <div className="marquee__content" aria-hidden="true">
              <div className="marquee__repeated-items">
                {marqueeItems.map((item) => (
                  <div className="marquee__item" key={`${item.id}-duplicate`}>
                    <item.Icon className="marquee__icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="daily-count-display" aria-label="Daily cup progress">
            <strong>{soldOut ? `${cupLimit}/${cupLimit}` : `${orderedCount}/${cupLimit}`}</strong>
            <span>{soldOut ? 'cups sold out today' : 'cups served today'}</span>
          </div>

          <div className="hero-cta-row">
            <button
              className="hero-primary-button"
              type="button"
              disabled={soldOut}
              onClick={() => openOrderModal(1)}
            >
              {soldOut ? 'Sold Out' : 'Order Now'}
            </button>
          </div>

          <div className="marquee__wrapper" aria-label="Cafe highlights under order button">
            <div className="marquee__content">
              <div className="marquee__repeated-items">
                {marqueeItems.map((item) => (
                  <div className="marquee__item" key={`${item.id}-cta` }>
                    <item.Icon className="marquee__icon" />
                  </div>
                ))}
              </div>
            </div>
            <div className="marquee__content" aria-hidden="true">
              <div className="marquee__repeated-items">
                {marqueeItems.map((item) => (
                  <div className="marquee__item" key={`${item.id}-cta-duplicate`}>
                    <item.Icon className="marquee__icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          
        </div>
        
      </div>
      <div className="home-showcase-footer">
            <div className="hero-social" aria-label="Social media links">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
            </div>
            <p>
          &copy; {new Date().getFullYear()} {settings.cafe_name || 'Cafe 67'}. All rights reserved.
        </p>
          </div>
          
    </section>
  )

  const renderMenuSections = () => (
    <div className="page-sections menu-page-sections">
      <section className="category-slider-shell" aria-label="Menu categories">
        <button
          type="button"
          className="category-scroll-button left"
          aria-label="Scroll categories left"
          disabled={!canScrollCategoriesLeft}
          onClick={() => scrollCategories(-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="category-slider-viewport" ref={categorySliderRef}>
          <div className="category-slider">
            <button
              type="button"
              className={`category-slide ${activeCategorySlug === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategorySlug('all')}
            >
              <img src={fallbackHero} alt="All drinks" />
              <span>All drinks</span>
              <strong>{products.length}</strong>
            </button>
            {categories.map((category, index) => {
              const categoryProducts = products.filter((product) => product.category?.slug === category.slug)

              return (
                <button
                  type="button"
                  className={`category-slide ${activeCategorySlug === category.slug ? 'active' : ''}`}
                  key={category.id}
                  onClick={() => setSelectedCategorySlug(category.slug)}
                >
                  <img
                    src={category.image_url || fallbackImages[index % fallbackImages.length]}
                    alt={category.name}
                  />
                  <span>{category.name}</span>
                  <strong>{categoryProducts.length}</strong>
                </button>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          className="category-scroll-button right"
          aria-label="Scroll categories right"
          disabled={!canScrollCategoriesRight}
          onClick={() => scrollCategories(1)}
        >
          <ChevronRight size={18} />
        </button>
      </section>

      <section className="section-shell menu-shop-shell">
        <div className="shop-grid" aria-label="Shop menu">
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
            : filteredProducts.map((product, index) => (
            <article className="shop-card" key={product.id}>
              <img
                src={product.image_url || fallbackImages[index % fallbackImages.length]}
                alt={product.name}
              />
              <div>
                <span>{product.category?.name || 'Drink'}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="shop-card-footer">
                  <strong>{money(product.price)}</strong>
                  <button
                    type="button"
                    disabled={soldOut || !product.is_available}
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!isCatalogLoading && filteredProducts.length === 0 ? (
          <p className="empty-menu-copy">No drinks are available in this category yet.</p>
        ) : null}
      </section>
    </div>
  )

  const renderAboutSections = () => (
    <div className="page-sections">
      <section className="section-card-grid">
        <article>
          <strong>Small daily limit</strong>
          <span>67 cups keeps the experience controlled, fast, and fresh.</span>
        </article>
        <article>
          <strong>Premium workflow</strong>
          <span>
            Products, orders, banners, and daily limits stay synced with the Laravel
            backend.
          </span>
        </article>
        <article>
          <strong>Warm hospitality</strong>
          <span>
            Designed to feel intentional, premium, and easy to order from mobile or
            desktop.
          </span>
        </article>
      </section>
      <section className="wide-story-card">
        <div>
          <p>Why it works</p>
          <h2>Every order respects the daily service limit</h2>
        </div>
        <span>
          The storefront keeps the customer experience focused, while the menu,
          checkout, and account flows stay directly connected to the Laravel backend.
        </span>
      </section>
    </div>
  )

  const renderContactSections = () => (
    <div className="page-sections">
      <section className="section-card-grid">
        <article>
          <strong>Phone</strong>
          <span>{settings.phone || '+1 555 670 067'}</span>
        </article>
        <article>
          <strong>WhatsApp</strong>
          <span>{settings.whatsapp || '+1 555 670 067'}</span>
        </article>
        <article>
          <strong>Hours</strong>
          <span>
            {shortTime(settings.opens_at)} - {shortTime(settings.closes_at || '21:00')}
          </span>
        </article>
      </section>
      <section className="wide-story-card contact-story-card">
        <div>
          <p>Need help?</p>
          <h2>Order support without friction</h2>
        </div>
        <span>
          Contact the cafe team for address clarification, daily availability, or
          special ordering requests before the cup limit closes for the day.
        </span>
      </section>
    </div>
  )

  const renderCheckoutSections = () => (
    <div className="page-sections checkout-sections">
      <section className="checkout-items-panel">
        <div className="section-heading left">
          <p>Cart items</p>
          <h2>Review your drinks</h2>
        </div>
        {cartItems.length === 0 ? (
          <p className="muted-copy">No items added yet. Start from the menu page.</p>
        ) : (
          cartItems.map((item) => (
            <article className="checkout-line" key={item.product_id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{money(item.product.price)} each</span>
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
          <span>{cartCups} cups</span>
          <strong>{money(cartTotal)}</strong>
        </div>
      </section>

      <form className="checkout-form" onSubmit={submitOrder}>
        <div className="section-heading left">
          <p>Delivery details</p>
          <h2>Delivery information</h2>
        </div>
        <label>
          Full name
          <input
            required
            value={checkoutForm.customer_name}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, customer_name: event.target.value })
            }
          />
        </label>
        <label>
          Phone number
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
          <p className="field-hint error">Enter a valid phone number with country code.</p>
        ) : null}
        <label>
          Car number
          <input
            required
            value={checkoutForm.car_number}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, car_number: event.target.value })
            }
          />
        </label>
        <label>
          Notes
          <textarea
            value={checkoutForm.customer_notes}
            onChange={(event) =>
              setCheckoutForm({ ...checkoutForm, customer_notes: event.target.value })
            }
          />
        </label>
        <button type="submit" disabled={cartItems.length === 0 || soldOut || !isCheckoutPhoneValid}>
          Place order
        </button>
      </form>
    </div>
  )

  const renderDashboardTiles = () => {
    const tiles = [
      {
        key: 'orders',
        title: 'Orders',
        description: orders.length > 0 ? `${orders.length} recent orders` : 'Track your latest cafe orders',
      },
      {
        key: 'addresses',
        title: 'Addresses',
        description: `${userAddresses.length} saved address${userAddresses.length === 1 ? '' : 'es'}`,
      },
      {
        key: 'details',
        title: 'Account details',
        description: 'Edit your profile name and main phone number',
      },
      {
        key: 'logout',
        title: 'Logout',
        description: 'Sign out from your Cafe 67 account',
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
          <p>Account details</p>
          <h3>Edit your main profile details</h3>
        </div>
      </div>
      <div className="profile-details-grid">
        <label>
          Name
          <input
            required
            value={profileForm.name}
            onChange={(event) =>
              setProfileForm({ ...profileForm, name: event.target.value })
            }
          />
        </label>
        <label>
          Account phone
          <input
            value={profileForm.phone}
            onChange={(event) =>
              setProfileForm({ ...profileForm, phone: event.target.value })
            }
          />
        </label>
      </div>
      <div className="account-actions-row">
        <button type="submit">Save account details</button>
      </div>
    </form>
  )

  const renderAddressesView = () => (
    <form className="account-form account-dashboard-form" onSubmit={updateProfile}>
      <div className="address-manager-header account-dashboard-section-header">
        <div>
          <p>Addresses</p>
          <strong>{userAddresses.length} saved address{userAddresses.length === 1 ? '' : 'es'}</strong>
        </div>
        <button type="button" className="ghost-button compact" onClick={addAddress}>
          Add address
        </button>
      </div>

      <div className="address-card-grid">
        {userAddresses.map((address, index) => (
          <article className="address-edit-card" key={address.id || `address-${index}`}>
            <div className="address-edit-card-header">
              <strong>Address {index + 1}</strong>
              <div>
                <button
                  type="button"
                  className={address.is_default ? 'address-pill active' : 'address-pill'}
                  onClick={() => setDefaultAddress(index)}
                >
                  {address.is_default ? 'Default' : 'Set default'}
                </button>
                <button type="button" className="address-remove" onClick={() => removeAddress(index)}>
                  Remove
                </button>
              </div>
            </div>
            <div className="address-fields-grid">
              <label>
                Phone
                <input
                  required
                  value={address.phone}
                  onChange={(event) => updateAddress(index, 'phone', event.target.value)}
                />
              </label>
              <label>
                Town / City
                <input
                  required
                  value={address.town_city}
                  onChange={(event) => updateAddress(index, 'town_city', event.target.value)}
                />
              </label>
              <label>
                Address
                <textarea
                  required
                  value={address.address}
                  onChange={(event) => updateAddress(index, 'address', event.target.value)}
                />
              </label>
              <label>
                Villa No. / Floor No.
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
        <button type="submit">Save addresses</button>
      </div>
    </form>
  )

  const renderOrdersView = () => (
    <section className="account-dashboard-block orders-dashboard-block">
      <div className="account-dashboard-section-header">
        <div>
          <p>Orders</p>
          <h3>Recent customer orders</h3>
        </div>
      </div>
      {orders.length === 0 ? (
        <p className="muted-copy">
          No orders yet. Shop the menu to place your first order.
        </p>
      ) : null}
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div>
            <strong>{order.order_number}</strong>
            <span>
              {order.items.length} lines · {money(order.total)}
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
        <p>Hello <strong>{user?.name || settings.cafe_name || 'Cafe 67'}</strong></p>
        <span>
          From your account dashboard you can view your recent orders, manage your saved addresses,
          and edit your account details.
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
                <span>Customer #{String(user.id || '').padStart(4, '0')}</span>
              </div>
            </div>

            <div className="account-dashboard-menu">
              <button
                type="button"
                className={accountView === 'dashboard' ? 'active' : ''}
                onClick={() => setAccountView('dashboard')}
              >
                Dashboard
              </button>
              <button
                type="button"
                className={accountView === 'orders' ? 'active' : ''}
                onClick={() => setAccountView('orders')}
              >
                Orders
              </button>
              <button
                type="button"
                className={accountView === 'addresses' ? 'active' : ''}
                onClick={() => setAccountView('addresses')}
              >
                Addresses
              </button>
              <button
                type="button"
                className={accountView === 'details' ? 'active' : ''}
                onClick={() => setAccountView('details')}
              >
                Account details
              </button>
              <button type="button" onClick={logout}>Logout</button>
            </div>
          </aside>

          <div className="account-dashboard-main">
            {renderAccountContent()}
          </div>
        </section>
      ) : (
        <section className="account-auth-layout">
          <article className="account-auth-intro">
            <p className="account-auth-kicker">Member Access</p>
            <h2 className="account-auth-title">
              Welcome Back to <span>{settings.cafe_name || 'Cafe 67'}</span>
            </h2>
            <p className="account-auth-copy">
              Sign in to access your account, manage orders, and update your delivery details.
            </p>
            <ul className="account-benefits">
              <li>Track your recent orders with live status.</li>
              <li>Save your address and speed up checkout.</li>
              <li>Recover your password from the same form.</li>
            </ul>
          </article>

          <section className="account-auth-card">
            <div className="account-auth-header">
              <h3>
                {authMode === 'login' ? 'Sign In' : null}
                {authMode === 'register' ? 'Create Account' : null}
                {authMode === 'forgot' ? 'Forgot Password' : null}
                {authMode === 'reset' ? 'Reset Password' : null}
              </h3>
              <p>
                {authMode === 'login' ? 'Use your account credentials to continue.' : null}
                {authMode === 'register' ? 'Set up your account details to get started.' : null}
                {authMode === 'forgot' ? 'Enter your email to receive a 6-digit OTP.' : null}
                {authMode === 'reset' ? 'Enter the OTP from your email and choose your new password.' : null}
              </p>
            </div>

            {(authMode === 'login' || authMode === 'register') && (
              <form className="account-auth-form" onSubmit={submitAuth}>
                {authMode === 'register' ? (
                  <>
                    <label>
                      Name
                      <input
                        required
                        value={authForm.name}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, name: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        value={authForm.phone}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, phone: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Town / City
                      <input
                        value={authForm.town_city}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, town_city: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Address
                      <textarea
                        value={authForm.address}
                        onChange={(event) =>
                          setAuthForm({ ...authForm, address: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Villa No. / Floor No.
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
                  Email
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
                  Password
                  <input
                    required
                    type="password"
                    minLength={8}
                    placeholder="Enter your password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm({ ...authForm, password: event.target.value })
                    }
                  />
                </label>

                <div className="account-links-row">
                  {authMode === 'login' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('forgot')}>
                      Forgot password?
                    </button>
                  ) : null}
                  {authMode === 'login' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('register')}>
                      Create account
                    </button>
                  ) : null}
                  {authMode === 'register' ? (
                    <button type="button" className="account-link-action" onClick={() => setAuthMode('login')}>
                      Back to sign in
                    </button>
                  ) : null}
                </div>

                <button type="submit">
                  {authMode === 'register' ? 'Create Account' : 'Login'}
                </button>
              </form>
            )}

            {authMode === 'forgot' ? (
              <form className="account-auth-form" onSubmit={sendResetLink}>
                <label>
                  Email
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
                    Back to sign in
                  </button>
                </div>

                <button type="submit">Send OTP</button>
              </form>
            ) : null}

            {authMode === 'reset' ? (
              <form className="account-auth-form" onSubmit={resetPassword}>
                <label>
                  Email
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
                  OTP code
                  <input
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={resetForm.otp}
                    onChange={(event) =>
                      setResetForm({ ...resetForm, otp: event.target.value.replace(/\D/g, '').slice(0, 6) })
                    }
                  />
                </label>
                <label>
                  New password
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
                  Confirm password
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
                    Back to sign in
                  </button>
                  <button
                    type="button"
                    className="account-link-action"
                    disabled={!canResendOtp}
                    onClick={resendOtp}
                  >
                    {canResendOtp ? 'Resend OTP' : `Resend in ${resendRemainingSeconds}s`}
                  </button>
                </div>

                <button type="submit">Reset Password</button>
              </form>
            ) : null}

            {authMode === 'forgot' ? (
              <button
                type="button"
                className="account-link-action standalone"
                onClick={() => setAuthMode('reset')}
              >
                Already have an OTP code?
              </button>
            ) : null}
          </section>
        </section>
      )}
    </div>
  )

  const renderPageSections = () => {
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
    if (activePage.path === '/') {
      return (
        <section className="hero-surface home-hero home-showcase-surface">
          <div className="hero-inner home-hero-inner">
            <div className="hero-home-actions">
              <header className={`site-nav home-site-nav ${scrolled ? 'is-scrolled' : ''}`}>
                <a
                  className="site-brand"
                  href="/"
                  onClick={(event) => openPage('/', event)}
                  aria-label={settings.cafe_name || 'Cafe 67'}
                >
                  <img src={brandLogo} alt={settings.cafe_name || 'Cafe 67'} />
                </a>

                <nav aria-label="Main navigation">
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
                    className="menu-button"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(true)
                      setCartOpen(false)
                    }}
                    aria-label="Open menu"
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
                    aria-label="Open cart"
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
    <main className={`site-shell route-${activePage.path === '/' ? 'home' : activePage.path.slice(1).replaceAll('/', '-')}`}>
      {activePage.path !== '/' ? (
        <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
          <a
            className="site-brand"
            href="/"
            onClick={(event) => openPage('/', event)}
            aria-label={settings.cafe_name || 'Cafe 67'}
          >
            <img src={brandLogo} alt={settings.cafe_name || 'Cafe 67'} />
          </a>

          <nav aria-label="Main navigation">
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
              className="menu-button"
              type="button"
              onClick={() => {
                setMobileMenuOpen(true)
                setCartOpen(false)
              }}
              aria-label="Open menu"
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
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              <span>{cartCups}</span>
            </button>
          </div>
        </header>
      ) : null}

      {notice ? (
        <div className="notice" role="status" aria-live="polite">
          <div className="notice-body">
            <strong>Notification</strong>
            <span>{notice}</span>
          </div>
          <button className="notice-dismiss" type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">
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
        products={products}
        fallbackImages={fallbackImages}
        cartItems={cartItems}
        cartCups={cartCups}
        cartTotal={cartTotal}
        soldOut={soldOut}
        money={money}
        addToCart={addToCart}
        setQuantity={setQuantity}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        isCheckoutPhoneValid={isCheckoutPhoneValid}
        userAddresses={userAddresses}
        selectedCheckoutAddressId={selectedCheckoutAddressId}
        applyCheckoutAddress={applyCheckoutAddress}
        onSubmitOrder={submitOrder}
      />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <strong>Your Cart</strong>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <p className="empty-cart">No drinks added yet.</p>
        ) : (
          cartItems.map((item) => (
            <article className="cart-line" key={item.product_id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{money(item.product.price)} each</span>
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
          <span>{cartCups} cups</span>
          <strong>{money(cartTotal)}</strong>
        </div>
        <button
          className="checkout-link"
          type="button"
          disabled={cartItems.length === 0}
          onClick={() => openPage('/checkout')}
        >
          Go to checkout
        </button>
      </aside>

      <aside className={`cart-drawer mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile menu">
        <div className="cart-drawer-header">
          <strong>Menu</strong>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="mobile-menu-links" aria-label="Mobile navigation">
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
