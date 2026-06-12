import { useEffect, useMemo, useState } from 'react'
import { GlassWater, Minus, Package, Plus, X } from 'lucide-react'
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import StripePaymentStep from './StripePaymentStep'
import { getProductImageUrl } from '../lib/media'
import { getStripe } from '../lib/stripe'

const PhoneInput = ReactPhoneInput?.default || ReactPhoneInput

const modalTranslations = {
  en: {
    orderNow: 'Order now',
    buildOrder: 'Build your order in 3 steps',
    closePopup: 'Close order popup',
    orderSteps: 'Order steps',
    products: 'Products',
    checkout: 'Checkout',
    payment: 'Payment',
    selectProducts: 'Select products',
    chooseFromMenu: 'Choose from the current menu',
    cupsServedToday: 'How far are we?',
    iceV60Only: 'ice v60 only',
    cups: 'cups',
    drink: 'Drink',
    decrease: 'Decrease',
    increase: 'Increase',
    remove: 'Remove',
    add: 'Add',
    unavailable: 'Unavailable',
    checkoutDetails: 'Checkout details',
    setDetails: 'Set your details',
    savedAddresses: 'Saved addresses',
    fullName: 'Name',
    address: 'Address',
    cupType: 'Cup type',
    cupTypeCarton: 'Carton',
    cupTypePlastic: 'Plastic',
    carBrand: 'What car do you have?',
    carNumber: 'Car number',
    phoneNumber: 'Your phone number',
    validPhone: 'Enter a valid phone number with country code.',
    checkingLoyalty: 'Checking loyalty status...',
    loadingMenu: 'Loading menu...',
    useReward: 'Use free cup reward ({count} available)',
    freeCupsToUse: 'Free cups to use',
    paymentWiring: 'Pay securely with card or Apple Pay',
    paymentPlaceholder: 'Payment component placeholder',
    paymentPlaceholderBody: 'This step is ready in the popup flow. We can connect card, Apple Pay, or any gateway here in the next pass.',
    payNow: 'Pay {total}',
    creatingOrder: 'Creating order...',
    processingPayment: 'Processing your card...',
    processingPaymentBody: 'Please wait. Do not close this window.',
    confirmingPayment: 'Confirming payment...',
    confirmingPaymentBody: 'Your card was charged. We are verifying the payment with the cafe.',
    paymentFailed: 'Payment failed. Try again.',
    orderNumber: 'Order number',
    totalCups: 'Total cups',
    totalAmount: 'Total amount',
    back: 'Back',
    continueCheckout: 'Continue to checkout',
    continuePayment: 'Continue to payment',
    placeOrder: 'Place order',
  },
  ar: {
    orderNow: 'اطلب الحين',
    buildOrder: 'كوّن طلبك في 3 خطوات',
    closePopup: 'إغلاق نافذة الطلب',
    orderSteps: 'خطوات الطلب',
    products: 'المنتجات',
    checkout: 'البيانات',
    payment: 'الدفع',
    selectProducts: 'اختر المنتجات',
    chooseFromMenu: 'شو خاطرك اليوم؟',
    cupsServedToday: 'كم واصلين اليوم',
    iceV60Only: 'ice v60 only',
    cups: 'كوب',
    drink: 'مشروب',
    decrease: 'تقليل',
    increase: 'زيادة',
    remove: 'حذف',
    add: 'إضافة',
    unavailable: 'غير متوفر',
    checkoutDetails: 'تفاصيل الطلب',
    setDetails: 'كمل طلبك',
    savedAddresses: 'العناوين المحفوظة',
    fullName: 'الاسم',
    address: 'عنوان',
    cupType: 'نوع الكوب',
    cupTypeCarton: 'كرتون',
    cupTypePlastic: 'بلاستيك',
    carBrand: 'شو من المواتر عندك؟',
    carNumber: 'لوحة سيارتك',
    phoneNumber: 'رقم تلفونك',
    validPhone: 'اكتب رقم جوال صحيح مع مفتاح الدولة.',
    checkingLoyalty: 'جاري التحقق من الولاء...',
    loadingMenu: 'جاري تحميل القائمة...',
    useReward: 'استخدم مكافأة كوب مجاني ({count} متاح)',
    freeCupsToUse: 'عدد الأكواب المجانية',
    paymentWiring: 'ادفع بأمان بالبطاقة أو Apple Pay',
    paymentPlaceholder: 'مكان مخصص لمكون الدفع',
    paymentPlaceholderBody: 'الخطوة جاهزة داخل النافذة. نقدر نربط البطاقة أو Apple Pay أو أي بوابة دفع في المرحلة الجاية.',
    payNow: 'ادفع {total}',
    creatingOrder: 'جاري إنشاء الطلب...',
    processingPayment: 'جاري معالجة البطاقة...',
    processingPaymentBody: 'انتظر شوي ولا تقفل النافذة.',
    confirmingPayment: 'جاري تأكيد الدفع...',
    confirmingPaymentBody: 'تم خصم المبلغ. عم نتأكد من الدفع مع المقهى.',
    paymentFailed: 'فشل الدفع. حاول مرة ثانية.',
    orderNumber: 'رقم الطلب',
    totalCups: 'إجمالي الأكواب',
    totalAmount: 'الإجمالي',
    back: 'رجوع',
    continueCheckout: 'كمل طلبك',
    continuePayment: 'ادفع الحين',
    placeOrder: 'تأكيد الطلب',
  },
}

function getModalText(language, key) {
  const selected = modalTranslations[language] || modalTranslations.en
  return selected[key] || modalTranslations.en[key] || key
}

function formatPayAmount(value, language) {
  const amount = new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))

  return language === 'ar' ? `${amount} د.إ` : `AED ${amount}`
}

function getArabicRemainingCupsMessage(remainingCups) {
  return matchRemainingCupsMessage(Number(remainingCups) || 0)
}

function matchRemainingCupsMessage(remainingCups) {
  switch (remainingCups) {
    case 3:
      return 'ثلاث قلاصات باقيلك للبلاش'
    case 2:
      return 'كلهم قلاصين و يصير عندك البلاش'
    case 1:
      return 'باقي قلاص واحد عشان تعزم ببلاش'
    default:
      return `باقي لك ${remainingCups} أكواب وتاخذ كوب مجاني.`
  }
}

const carBrands = [
  { name: 'Abarth', logo: 'https://logo.clearbit.com/abarth.com' },
  { name: 'Acura', logo: 'https://logo.clearbit.com/acura.com' },
  { name: 'Alfa Romeo', logo: 'https://logo.clearbit.com/alfaromeo.com' },
  { name: 'Aston Martin', logo: 'https://logo.clearbit.com/astonmartin.com' },
  { name: 'Audi', logo: 'https://logo.clearbit.com/audi.com' },
  { name: 'Bentley', logo: 'https://logo.clearbit.com/bentleymotors.com' },
  { name: 'BMW', logo: 'data:image/png;base64,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' },
  { name: 'BYD', logo: 'https://logo.clearbit.com/byd.com' },
  { name: 'Bugatti', logo: 'https://logo.clearbit.com/bugatti.com' },
  { name: 'Buick', logo: 'https://logo.clearbit.com/buick.com' },
  { name: 'Cadillac', logo: 'data:image/png;base64,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' },
  { name: 'Chery', logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAACUCAMAAABY+0dBAAAAY1BMVEX///8xMTEnJycAAADFxcXf39/n5+e2trZjY2MsLCxWVlZgYGB2dnYgICAQEBAbGxubm5v09PTt7e0VFRVKSkqIiIh8fHw3Nze+vr6SkpJRUVGurq7T09M/Pz9oaGhFRUWkpKTu7SPzAAALFElEQVR4nO1d6YKjrBJtcQtRRMUl7r7/U14i4JIokKQ7yTeX82vaIFCHoiiwivn5MTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMJAgSZI0TT3Pcxd4Hn2UJsmn+/YGpJ7bOhe/aeK4yvMw7PvTeUbQ92FY5FUcN41/cVrXSz/d399H2joNlT3sg7qDOIoiQjBGCIEN6AOMCaE/Y9jVQR9SVhqn/Tf4SFu/Kqj8Q4kIFR1AaAlACKnwYHoAp582P1JeMEHlQBkpKv8/TYfbFPXQcSGZfIAKZ3MAWNdBWNTX53URBlkGgfgtIgjMbCEErW6oi8b9tERPoK2yCItRnqQhkW2TLMxH33G92SQ6AdOIwOEPksRzHX/MwwwzPkQNtAocZVX7KYkeRpK28WDbGDIFp6pfdl2dj5f2bj1IGmwDrip21Nz9nrrOmNddV1rXeqYKKTtD3KZfv7Skrh9im1ylgwCjMgv6vHG83bKJk9nWCvbg7MvnOU3eB1mJ8GRQALFR6LtfbDTSdgyRjaYBxlEXyG2cm0fA2gBE+bEVmKzuqYvw9BJtJhy/1IBSFsoI8V6eqR64Mv1Nmhpz+REhiP+TZPfzY/2SS3UjwLyVqKNc/LYUryK55DVGkE32XkEChVdYTHgYgT6OQxSxZQVZ4f48WlqidqOPJtMCEa7zy1eZiyYo2XKH7XrU8AidATHBMYpd6lWnboyYgkDUOcrXU2+sbcyW4zJofkOCX0FTgsmKQdsuVKowocLcOtjBPP5ewC0nwJVGFYlb2PbUKADld1DRsg5ZAAx6HXKziItMxvXzkXCvK8r0PKdmABOhdAA+byvckNMAaz0aEp9bB+tuEjid+MXy9WZ+U0NORfhZrzNpSjJ1BNexXtfdinDfGfV3fXd7bjoAqfQES+J68twsXErXmz9GmjPdBFDiAGxwmS0ByHdsaprD2Xpc9Gp0+Sv7Fb4H7onNalCOeqORjBZ3HgDcfyUZBRPY0q60ZNODnD40PdKBr3jQ13vBDZHYhILD8b4AzgREuvPe53tbPHxGJ4RpI5o8XDrhUgMiEdElc7FOc3r4RJhfvfK/i4DzgAut4mlhi2MXVMqLCobpYlDojXHBZxw6aRX/VYxi3Gyt4u4gdpp0uVAVFosHrbzTmx6icjBqFf9FpAEnAukoROKLcwdqUXKlEUzy+dAO2FouRcGVCATvNhN+ybtqa1gI6g5bQjBLx+FIYms+vqRuu0Z3RAOlpsH6NVRiE61BxOUsClN90PN7kmY5yMVntc2cidDaqPwikmI+QlC1nFTlfAADieY6QNmLZiZAWanYi4kwxMV7Hcw0nC07lJd0a7Ac0j+yOWqXczwIasX0mGcSCt9rJJJi1nZben7Q2Mt5HLQfcv1ae2EQ2NItnTOTht+sEYsu0raPxyDpV8ezwFIcPt3CtVaHmnZ/LGEyj4pF4sfaeBmXcpnC5yMmnA6veBgePjRwsxUTuDs45P5Jz4sR0nVGfw1pv/QR7e920hiu5ADnJw5P2npdA4h3GXdPaCnTv327cVl9qET1zhrahhiupFCZu320a52AONwh0z8vPED4boWgyBcrQXcPdwcScbaaFnT/9OQW2e3WHz9wdmsC3LxceLBI/lwrLyE5rySFKNus9WkBNl9vogft5AJv8zUMgM02LKkytFI7fP7IKVVikU0Xu+Ukpem2H7HkS6wc7YYJqlvzQpqM3YbuyPrQaV1yIqvhoG6jffLbtvXDKIKbzkcvrWlxtKkMRlE4NXOyb5pX7mr/DEkFtyOPpuAGZG0BrZdMeWrBmwr3mgFQ6Yf/JS4Buu3lPbB64y1DkmNlExBp7Mz+FF7cRapeRuNrbYzqFrr489E0bU4UI4bC1zQivJ1rNyAk//yXrp9rwEdhy6kArxlLIK2cRMWR7/12JG1hy9QXwtp/0l6mfg1lViiyi/uQpE8ijW0CjnsMESHlKW8uraZn5bWXJj+VhEiMMQTEHr8waubSlxaQkoEjFjtY1n2RV+Po+xdnxsX3x7HKi77ueDEsJQFYZf+Cn/anSJvwXMq6z4W4RgpeI2ztG0wRuZug1ENKy3PYfKEyLPD8vB+wbJa8CDof8NDn/tObl/fBc5qqL23Z7H6WBETssq+O4hW/EInXOjElQ2pAH+OAGkZKQkyt7VctEhpIUq/184BcrZ7cE1AAXG0sCXK/9b4/4vYQSZK2Y5EpV4E9JeCrTFaMzj+Uz+K1TRXWkAFIwQtlYdXouh3/QdAJc/HHOC/CPqBYZfBQ9GGRx6PvtN8caW1gYGBgYGBgYGBgYGBgYGBgYPAWuK0jB0/GdtkfqiO1hL20iV5IVE3whlhpvcLicDO9zF8RVZLO7ezEFFwC5dky4cHO1XQiHamac6dQsHVgcHvSO8S243UNamQsyMyZ82tDec9E5k10FzicjMRWfo8BFh9cRoQyXI6JsUSTJYW6jQkwEq9UyoAZ9oLdTRK5AQ90RbZEXV3I+ALRXWhme9ahnojgvueI2ESpS7FkNKSl5vchwCUXWbTwOA2q4Xf5AOsu9OoC1SFblOVefGh4johKlweyShXzibo8E6tjgjciI5VUu0qRVuxTEwT3UeQOErfekNuP9Wsssc5PEZFyHqRtTLBWPUxDZXGbXdOCeTttz0IwIe53LGHbs8kGrHuePEto0ylu/GMs0UpPEcEDBXEsaYJh039XWdxvTteqYcb7R8ecCYTv4+XHjGkY6nZmTs9MBy4d3Y/NTxHBkjzsvwiJbK8iwE4QmDR8aEF5Yw0rHrYcnXciEi/MzpKz/qfGZ4hIWE598CcfdJurSqyyHdtOXNayXh89kVxr7+Y8MYVAh6k4O3iGCG9658WwyyP4U+Xr1K+TuKLBmnvp8KQGuJ+l6QzstpZHole/joiKznxYbvojZgEUGjmyVDsIhn1RWUgneSiqm3uW/vV2TgnaeyJA78rf2c5PRQMCzTSW3fZdJ+OXI0bXdGI3ZyoC4dEdT8yYH9/pcEwErE9ysLyzDRGw66WvBNts8+qsaGJCPWVGgFu32g25H2sHTssv+Tm+94Ol9T6YfcaIsBQxH8JCr4lQvXMz3fpI1cQUXMLaudP4OcMOD9w8RPXhdGZpveD+8hsNIvSwJUIOcnP9gCokfQV7vO9nMttHrhqSe0q+i4jbrZI2EXCPh6t4tb0uI1kZ+dSo3zU1LOnEuM195kQoJgUV0TpS+SQXTCAkX+XYHQi6d8WsiYB1IMeOsbQ62Qt3fg4jAhy+wDJDodTCXbiXGSiUfpyKPZZfrulHeDt+hN6lNAKMiOMLXNphuslwkPXEZRnFyssleA42emT9fJtDxYk4fieeChDZfQluxq4vU+bHhuxyr+wBK/E9RLhs+iHJzNYmohV7Vn2d+B4ifhpmCCU7Rm0ixEVOqNO9dO4VIp6yETLy2DmsJJlQn4gfsT0B5dCHUvTrU+xniICDvIEZ2kS0bBijQyvxABGJuAJFFSgt1vnniZD7EUtDjjYR4hjh8F6yB4j48TKtY3Ykbqp4hQgdYJHprUMEv5ns8C6fR4j4SfMSKzsKoZD8j4mAQOi5FhHj1Aw8ugTvISKo/1UMNkZSfSVzmneF1vorIWIqxomQV743AykR0+5TQUSS4Wupo2sJ3GFq+f5jzlF117vZzxLUy+n4OD3oVJ6H212LDeP0hyere9vQ4h7l9fVBqVhynWF67bRvL91+quTuPhIJkvV/BnOPZalO2QOVS5CwYun6Dx0sAvEOqTruyvojGv5302AMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP6P8D8ncrRQo+MjLgAAAABJRU5ErkJggg==' },
  { name: 'Chevrolet', logo: 'https://logo.clearbit.com/chevrolet.com' },
  { name: 'Chrysler', logo: 'https://logo.clearbit.com/chrysler.com' },
  { name: 'Citroen', logo: 'https://logo.clearbit.com/citroen.com' },
  { name: 'Cupra', logo: 'https://logo.clearbit.com/cupraofficial.com' },
  { name: 'Dacia', logo: 'https://logo.clearbit.com/dacia.com' },
  { name: 'Daewoo', logo: 'https://logo.clearbit.com/daewoo.com' },
  { name: 'DS Automobiles', logo: 'https://logo.clearbit.com/dsautomobiles.com' },
  { name: 'Dodge', logo: 'https://logo.clearbit.com/dodge.com' },
  { name: 'Dongfeng', logo: 'data:image/png;base64,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' },
  { name: 'Ferrari', logo: 'https://logo.clearbit.com/ferrari.com' },
  { name: 'Fiat', logo: 'https://logo.clearbit.com/fiat.com' },
  { name: 'Ford', logo: 'https://logo.clearbit.com/ford.com' },
  { name: 'Geely', logo: 'data:image/png;base64,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' },
  { name: 'Genesis', logo: 'https://logo.clearbit.com/genesis.com' },
  { name: 'GMC', logo: 'https://logo.clearbit.com/gmc.com' },
  { name: 'Great Wall', logo: 'https://logo.clearbit.com/gwm-global.com' },
  { name: 'Haval', logo: 'https://logo.clearbit.com/haval-global.com' },
  { name: 'Hongqi', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmSX_Nji5o59gyGcQFCJC7MkR3nOtNkJRJ-g&s' },
  { name: 'Honda', logo: 'https://logo.clearbit.com/honda.com' },
  { name: 'Hyundai', logo: 'https://logo.clearbit.com/hyundai.com' },
  { name: 'Infiniti', logo: 'https://logo.clearbit.com/infiniti.com' },
  { name: 'Isuzu', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3W3M75LTvxC3ztx86YONMaA8xkuFinzNXAA&s' },
  { name: 'Jaguar', logo: 'https://logo.clearbit.com/jaguar.com' },
  { name: 'Jeep', logo: 'https://logo.clearbit.com/jeep.com' },
  { name: 'Kia', logo: 'https://logo.clearbit.com/kia.com' },
  { name: 'Koenigsegg', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQywjHvOd-O8C5wtbtZs2mbhJLyZj-r1oRfg&s' },
  { name: 'Lamborghini', logo: 'https://logo.clearbit.com/lamborghini.com' },
  { name: 'Lancia', logo: 'https://logo.clearbit.com/lancia.com' },
  { name: 'Land Rover', logo: 'https://logo.clearbit.com/landrover.com' },
  { name: 'Lexus', logo: 'https://logo.clearbit.com/lexus.com' },
  { name: 'Li Auto', logo: 'https://logo.clearbit.com/lixiang.com' },
  { name: 'Lincoln', logo: 'https://logo.clearbit.com/lincoln.com' },
  { name: 'Lotus', logo: 'https://logo.clearbit.com/lotuscars.com' },
  { name: 'Lucid', logo: 'https://logo.clearbit.com/lucidmotors.com' },
  { name: 'Mahindra', logo: 'https://logo.clearbit.com/mahindra.com' },
  { name: 'Maruti Suzuki', logo: 'https://logo.clearbit.com/marutisuzuki.com' },
  { name: 'Maserati', logo: 'https://logo.clearbit.com/maserati.com' },
  { name: 'Mazda', logo: 'https://logo.clearbit.com/mazda.com' },
  { name: 'Maybach', logo: 'https://logo.clearbit.com/mercedes-benz.com' },
  { name: 'McLaren', logo: 'https://logo.clearbit.com/mclaren.com' },
  { name: 'Mercedes-Benz', logo: 'https://logo.clearbit.com/mercedes-benz.com' },
  { name: 'MG', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5thbStB5ASaJSbDFWiU1I-2hIdMFbUIWeKQ&s' },
  { name: 'Mini', logo: 'https://logo.clearbit.com/mini.com' },
  { name: 'Mitsubishi', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZC0NwjhxudDIA2QGQYFRxu-kXTcx42nhZpg&s' },
  { name: 'NIO', logo: 'https://logo.clearbit.com/nio.com' },
  { name: 'Nissan', logo: 'https://logo.clearbit.com/nissan-global.com' },
  { name: 'Opel', logo: 'https://logo.clearbit.com/opel.com' },
  { name: 'Pagani', logo: 'https://logo.clearbit.com/pagani.com' },
  { name: 'Perodua', logo: 'https://logos-world.net/wp-content/uploads/2022/12/Perodua-Logo.jpg' },
  { name: 'Peugeot', logo: 'https://logo.clearbit.com/peugeot.com' },
  { name: 'Polestar', logo: 'https://logo.clearbit.com/polestar.com' },
  { name: 'Porsche', logo: 'https://logo.clearbit.com/porsche.com' },
  { name: 'Pontiac', logo: 'https://logo.clearbit.com/pontiac.com' },
  { name: 'Proton', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAmCZlFpILgjgdg0A2RyiW9X_uBg4SH-PrYg&s' },
  { name: 'Ram', logo: 'https://logo.clearbit.com/ramtrucks.com' },
  { name: 'Renault', logo: 'https://logo.clearbit.com/renault.com' },
  { name: 'Rivian', logo: 'https://logo.clearbit.com/rivian.com' },
  { name: 'Roewe', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShu0SdYpvu8FW_8ndOhaSIfqbXL0z9holCrQ&s' },
  { name: 'Rolls-Royce', logo: 'https://logo.clearbit.com/rolls-roycemotorcars.com' },
  { name: 'Saab', logo: 'https://logo.clearbit.com/saab.com' },
  { name: 'Scion', logo: 'https://logo.clearbit.com/scion.com' },
  { name: 'Seat', logo: 'https://logo.clearbit.com/seat.com' },
  { name: 'Smart', logo: 'https://logo.clearbit.com/smart.com' },
  { name: 'Skoda', logo: 'https://logo.clearbit.com/skoda-auto.com' },
  { name: 'Subaru', logo: 'https://logo.clearbit.com/subaru.com' },
  { name: 'Suzuki', logo: 'https://logo.clearbit.com/suzuki.com' },
  { name: 'SsangYong', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl238JbHqcaN40zwQtVW8AEn3D52M0ApWU3A&s' },
  { name: 'Tata', logo: 'https://logo.clearbit.com/tatamotors.com' },
  { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
  { name: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
  { name: 'VinFast', logo: 'https://logo.clearbit.com/vinfastauto.com' },
  { name: 'Volkswagen', logo: 'https://logo.clearbit.com/vw.com' },
  { name: 'Volvo', logo: 'https://logo.clearbit.com/volvocars.com' },
  { name: 'XPeng', logo: 'https://logo.clearbit.com/xiaopeng.com' },
  { name: 'Zeekr', logo: 'https://logo.clearbit.com/zeekr.com' },
  { name: 'Other', logo: 'https://logo.clearbit.com/car.com' },
]

const VEHICLE_PROFILE_COOKIE = 'cafe67_vehicle_profile'

function readVehicleProfileCookie() {
  const cookieEntry = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${VEHICLE_PROFILE_COOKIE}=`))

  if (!cookieEntry) {
    return null
  }

  try {
    return JSON.parse(decodeURIComponent(cookieEntry.split('=').slice(1).join('=')))
  } catch {
    return null
  }
}

function writeVehicleProfileCookie(profile) {
  const value = encodeURIComponent(JSON.stringify(profile))
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${VEHICLE_PROFILE_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`
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

function getProductCategoryIconSrc(product) {
  const slug = String(product.category?.slug || '').toLowerCase()
  const label = `${product.name || ''} ${product.category?.name || ''}`.toLowerCase()

  if (slug.includes('cold') || label.includes('ice') || label.includes('cold')) {
    return '/melting.svg'
  }

  if (label.includes('v60')) {
    return '/v60.svg'
  }

  if (label.includes('pour')) {
    return '/pour-over.svg'
  }

  if (slug.includes('tea')) {
    return '/pour-over.svg'
  }

  return '/coffee-beans.svg'
}

function OrderProductImage({ product, fallbackSrc }) {
  const imageUrl = getProductImageUrl(product, fallbackSrc)
  const [useFallbackIcon, setUseFallbackIcon] = useState(!imageUrl)

  useEffect(() => {
    setUseFallbackIcon(!imageUrl)
  }, [imageUrl])

  if (!useFallbackIcon && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="order-product-thumb"
        loading="lazy"
        onError={() => setUseFallbackIcon(true)}
      />
    )
  }

  return (
    <span
      className="order-product-thumb order-product-thumb-icon"
      style={{ '--icon-url': `url(${getProductCategoryIconSrc(product)})` }}
      aria-hidden="true"
    />
  )
}

function BrandLogo({ logo, name, className = '' }) {
  const normalizedLogo = logo || ''
  const domain = normalizedLogo.replace('https://logo.clearbit.com/', '')
  const faviconFallback = domain
    ? `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
    : ''

  const [currentSource, setCurrentSource] = useState(normalizedLogo)
  const [showTextFallback, setShowTextFallback] = useState(!normalizedLogo)

  useEffect(() => {
    setCurrentSource(normalizedLogo)
    setShowTextFallback(!normalizedLogo)
  }, [normalizedLogo])

  if (showTextFallback) {
    return (
      <span className={`order-brand-logo-fallback ${className}`} aria-hidden="true">
        {name?.charAt(0) || 'C'}
      </span>
    )
  }

  return (
    <img
      src={currentSource}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        if (faviconFallback && currentSource !== faviconFallback) {
          setCurrentSource(faviconFallback)
          return
        }

        setShowTextFallback(true)
      }}
    />
  )
}

function OrderNowModal({
  isOpen,
  onClose,
  initialStep,
  products,
  isCatalogLoading = false,
  fallbackImages,
  cartItems,
  cartCups,
  cartTotal,
  orderedCount,
  cupLimit,
  soldOut,
  money,
  addToCart,
  setQuantity,
  checkoutForm,
  setCheckoutForm,
  loyaltyState,
  userAddresses,
  selectedCheckoutAddressId,
  applyCheckoutAddress,
  paymentConfig,
  pendingOrderData,
  onCreatePendingOrder,
  onOrderComplete,
  onPaymentSuccess,
  language = 'en',
}) {
  const [step, setStep] = useState(initialStep)
  const [pendingCheckout, setPendingCheckout] = useState(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [paymentPhase, setPaymentPhase] = useState('idle')
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    setStep(initialStep)

    if (!pendingOrderData) {
      setPendingCheckout(null)
      setPaymentError('')
      setIsCreatingOrder(false)
      setPaymentPhase('idle')
    }

    return undefined
  }, [initialStep, isOpen, pendingOrderData])

  useEffect(() => {
    if (!isOpen || !pendingOrderData?.payment?.client_secret) {
      return undefined
    }

    setPendingCheckout(pendingOrderData)
    setStep(3)

    return undefined
  }, [isOpen, pendingOrderData])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const t = (key) => getModalText(language, key)

  const hasSavedAddresses = useMemo(
    () => userAddresses.some((address) => address.address || address.phone || address.town_city || address.villa_floor),
    [userAddresses],
  )
  const isCheckoutPhoneValid = isValidInternationalPhone(checkoutForm.customer_phone)
  const canContinueFromProducts = cartCups > 0 && !soldOut
  const canContinueFromCheckout = isCheckoutPhoneValid
  const stripePromise = useMemo(
    () => getStripe(paymentConfig?.publishable_key),
    [paymentConfig?.publishable_key],
  )
  const pendingOrder = pendingCheckout?.order
  const orderPayment = pendingCheckout?.payment
  const orderTotal = pendingOrder?.total ?? cartTotal
  const payAmountLabel = formatPayAmount(orderTotal, language)
  const isPaymentBusy = paymentPhase === 'stripe' || paymentPhase === 'confirming'
  const payLabel = isCreatingOrder
    ? t('creatingOrder')
    : paymentPhase === 'stripe'
      ? t('processingPayment')
      : paymentPhase === 'confirming'
        ? t('confirmingPayment')
        : t('payNow').replace('{total}', payAmountLabel)
  const paymentStatusTitle = paymentPhase === 'confirming'
    ? t('confirmingPayment')
    : t('processingPayment')
  const paymentStatusBody = paymentPhase === 'confirming'
    ? t('confirmingPaymentBody')
    : t('processingPaymentBody')

  const handleContinueToPayment = async () => {
    if (!onCreatePendingOrder || isCreatingOrder) {
      return
    }

    setIsCreatingOrder(true)
    setPaymentError('')

    try {
      const data = await onCreatePendingOrder()

      if (!data) {
        return
      }

      if (!data.payment) {
        await onOrderComplete?.(data)
        return
      }

      setPendingCheckout(data)
      setStep(3)
    } catch (error) {
      setPaymentError(error.message || t('paymentFailed'))
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleStripePayStart = () => {
    setPaymentPhase('stripe')
    setPaymentError('')
  }

  const handleStripePaySuccess = async () => {
    if (!pendingCheckout || !onPaymentSuccess) {
      setPaymentPhase('idle')
      return
    }

    setPaymentPhase('confirming')

    try {
      await onPaymentSuccess(pendingCheckout)
    } catch (error) {
      setPaymentError(error.message || t('paymentFailed'))
      setPaymentPhase('idle')
    }
  }

  const handleStripePayError = (message) => {
    setPaymentPhase('idle')
    setPaymentError(message || t('paymentFailed'))
  }
  const loyaltyData = loyaltyState?.data
  const remainingCups = Number(loyaltyData?.remaining_cups || 0)
  const loyaltyMessage = language === 'ar'
    ? (
      !loyaltyData?.has_free_reward && remainingCups > 0
        ? getArabicRemainingCupsMessage(remainingCups)
        : (loyaltyData?.message_ar || loyaltyData?.message_en || loyaltyData?.message || '')
    )
    : (loyaltyData?.message_en || loyaltyData?.message_ar || loyaltyData?.message || '')
  const hasFreeReward = Boolean(loyaltyData?.has_free_reward)
  const freeCupsAvailable = Number(loyaltyData?.free_cups_available || 0)
  const maxRedeemableCups = Math.max(0, Math.min(freeCupsAvailable, cartCups))
  const selectedFreeCupsToUse = checkoutForm.use_free_cup
    ? Math.min(
      Math.max(Number.parseInt(checkoutForm.free_cups_to_use || '1', 10) || 1, 1),
      Math.max(1, maxRedeemableCups),
    )
    : 0
  const shouldShowLoyaltyBox = Boolean(
    loyaltyState?.loading
    || loyaltyState?.error
    || loyaltyMessage
    || hasFreeReward
  )
  const stepLabels = [t('products'), t('checkout'), t('payment')]
  const dailyCounterValue = soldOut ? `${cupLimit}/${cupLimit}` : `${orderedCount}/${cupLimit}`

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const saved = readVehicleProfileCookie()
    if (!saved) {
      return
    }

    setCheckoutForm((current) => ({
      ...current,
      customer_name: saved.customer_name || current.customer_name,
      car_type: saved.car_type || current.car_type,
      car_number: saved.car_number || current.car_number,
      customer_phone: saved.customer_phone || current.customer_phone,
    }))
  }, [isOpen, setCheckoutForm])

  useEffect(() => {
    const customerName = checkoutForm.customer_name?.trim() || ''
    const carType = checkoutForm.car_type?.trim() || ''
    const carNumber = checkoutForm.car_number?.trim() || ''
    const customerPhone = checkoutForm.customer_phone?.trim() || ''

    if (!customerName && !customerPhone) {
      return
    }

    writeVehicleProfileCookie({
      customer_name: customerName,
      car_type: carType,
      car_number: carNumber,
      customer_phone: customerPhone,
    })
  }, [checkoutForm.car_number, checkoutForm.car_type, checkoutForm.customer_name, checkoutForm.customer_phone])

  if (!isOpen) {
    return null
  }

  return (
    <div className="order-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="order-modal-header">
          <div>
            <p className="order-modal-kicker">{t('orderNow')}</p>
            <h2 id="order-modal-title">{t('buildOrder')}</h2>
          </div>
          <button type="button" className="order-modal-close" onClick={onClose} aria-label={t('closePopup')}>
            <X size={18} />
          </button>
        </header>

        <div className="order-modal-steps" aria-label={t('orderSteps')}>
          {stepLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`order-step-pill ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''} ${index < 2 ? 'clickable' : ''}`}
              onClick={() => {
                if (index === 0 || (index === 1 && canContinueFromProducts)) {
                  setStep(index + 1)
                }
              }}
              disabled={index > 1 || (index === 1 && !canContinueFromProducts)}
            >
              <div className="order-step-line" aria-hidden="true" />
              <span className="order-step-count">{index + 1}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>

        <div className="order-modal-body">
          {step === 1 ? (
            <div className="order-modal-panel">
              <div className="daily-count-display order-modal-counter" aria-label={t('cupsServedToday')}>
                <span>{t('cupsServedToday')}</span>
                <strong>{dailyCounterValue}</strong>
                <span className="order-modal-counter-note">{t('iceV60Only')}</span>
              </div>

              <div className="order-modal-section-heading">
                <div>
                  <p>{t('selectProducts')}</p>
                  <h3>{t('chooseFromMenu')}</h3>
                </div>
                <div className="order-modal-summary-chip">
                  <span>{cartCups} {t('cups')}</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
              </div>

              <div className="order-product-catalog" dir="ltr">
                {isCatalogLoading && products.length === 0 ? (
                  <p className="order-modal-loading-copy">{t('loadingMenu')}</p>
                ) : null}
                {products.map((product, index) => {
                  const cartItem = cartItems.find((item) => item.product_id === product.id)
                  const quantity = cartItem?.quantity || 0
                  const isUnavailable = soldOut || !product.is_available

                  return (
                    <article className="order-product-row" key={product.id}>
                      <OrderProductImage
                        product={product}
                        fallbackSrc={fallbackImages[index % fallbackImages.length]}
                      />
                      <div className="order-product-copy">
                        <strong className="order-product-name">{product.name}</strong>
                        <span className="order-product-price">{money(product.price)}</span>
                      </div>
                      <div className="order-product-actions">
                        {quantity > 0 ? (
                          <div className="quantity-controls order-catalog-quantity">
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              aria-label={`${t('decrease')} ${product.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span>{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              disabled={isUnavailable}
                              aria-label={`${t('increase')} ${product.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="order-product-add"
                            disabled={isUnavailable}
                            onClick={() => addToCart(product)}
                          >
                            {product.is_available ? t('add') : t('unavailable')}
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="order-modal-panel order-modal-checkout-panel">
              {hasSavedAddresses ? (
                <div className="saved-address-picker order-modal-address-picker">
                  <span>{t('savedAddresses')}</span>
                  <div>
                    {userAddresses.map((address, index) => {
                      const addressKey = address.id || `local-${index}`
                      const addressLabel = [address.address, address.villa_floor, address.town_city].filter(Boolean).join(', ') || `${t('address')} ${index + 1}`

                      return (
                        <button
                          key={addressKey}
                          type="button"
                          className={selectedCheckoutAddressId === addressKey ? 'active' : ''}
                          onClick={() => applyCheckoutAddress(address, addressKey)}
                        >
                          {addressLabel}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              <div className="order-checkout-grid">
                <fieldset className="order-checkout-field order-cup-type-field">
                  <div className="order-cup-type-options" role="radiogroup" aria-label={t('cupType')}>
                    <label className={`order-cup-type-option${checkoutForm.cup_type === 'carton' ? ' active' : ''}`}>
                      <input
                        type="radio"
                        name="cup_type"
                        value="carton"
                        checked={checkoutForm.cup_type === 'carton'}
                        onChange={(event) =>
                          setCheckoutForm({ ...checkoutForm, cup_type: event.target.value })
                        }
                      />
                      <span className="order-cup-type-icon" aria-hidden="true">
                        <Package size={18} strokeWidth={2.2} />
                      </span>
                      <span>{t('cupTypeCarton')}</span>
                    </label>

                    <label className={`order-cup-type-option${checkoutForm.cup_type === 'plastic' ? ' active' : ''}`}>
                      <input
                        type="radio"
                        name="cup_type"
                        value="plastic"
                        checked={checkoutForm.cup_type === 'plastic'}
                        onChange={(event) =>
                          setCheckoutForm({ ...checkoutForm, cup_type: event.target.value })
                        }
                      />
                      <span className="order-cup-type-icon" aria-hidden="true">
                        <GlassWater size={18} strokeWidth={2.2} />
                      </span>
                      <span>{t('cupTypePlastic')}</span>
                    </label>
                  </div>
                </fieldset>

                <label className="order-checkout-field order-checkout-field--phone">
                  {t('phoneNumber')}
                  <PhoneInput
                    country="ae"
                    onlyCountries={['ae']}
                    countryCodeEditable={false}
                    enableSearch={false}
                    disableDropdown={false}
                    placeholder="50 123 4567"
                    containerClass="phone-field"
                    inputClass="phone-field-input"
                    buttonClass="phone-field-flag"
                    preferredCountries={['ae']}
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

                <label className="order-checkout-field">
                  {t('carNumber')}
                  <input
                    value={checkoutForm.car_number}
                    onChange={(event) =>
                      setCheckoutForm({ ...checkoutForm, car_number: event.target.value })
                    }
                  />
                </label>

                <label className="order-checkout-field order-checkout-field--full">
                  {t('carBrand')}
                  <input
                    value={checkoutForm.car_type}
                    onChange={(event) =>
                      setCheckoutForm({ ...checkoutForm, car_type: event.target.value })
                    }
                  />
                </label>

                {!isCheckoutPhoneValid && checkoutForm.customer_phone ? (
                  <p className="field-hint error order-checkout-field order-checkout-field--phone-hint">{t('validPhone')}</p>
                ) : null}

                {shouldShowLoyaltyBox ? (
                  <div className="order-loyalty-box order-checkout-field order-checkout-field--phone" aria-live="polite">
                    {loyaltyState?.loading ? <p className="field-hint">{t('checkingLoyalty')}</p> : null}
                    {loyaltyState?.error ? <p className="field-hint error">{loyaltyState.error}</p> : null}

                    {loyaltyMessage ? <p className="field-hint">{loyaltyMessage}</p> : null}

                    {hasFreeReward ? (
                      <>
                        <label className="order-loyalty-toggle">
                          <input
                            type="checkbox"
                            checked={Boolean(checkoutForm.use_free_cup)}
                            onChange={(event) => {
                              const enabled = event.target.checked
                              setCheckoutForm((current) => ({
                                ...current,
                                use_free_cup: enabled,
                                free_cups_to_use: enabled
                                  ? String(
                                    Math.min(
                                      Math.max(Number.parseInt(current.free_cups_to_use || '1', 10) || 1, 1),
                                      Math.max(1, maxRedeemableCups),
                                    ),
                                  )
                                  : '',
                              }))
                            }}
                          />
                          <span>{t('useReward').replace('{count}', String(freeCupsAvailable))}</span>
                        </label>

                        {checkoutForm.use_free_cup ? (
                          <div className="order-loyalty-stepper">
                            {t('freeCupsToUse')}
                            <div className="order-loyalty-stepper-controls" aria-live="polite">
                              <button
                                type="button"
                                className="order-loyalty-stepper-button"
                                aria-label={language === 'ar' ? 'زيادة عدد الأكواب المجانية' : 'Increase free cups'}
                                disabled={selectedFreeCupsToUse >= maxRedeemableCups}
                                onClick={() => {
                                  setCheckoutForm((current) => ({
                                    ...current,
                                    free_cups_to_use: String(Math.min(maxRedeemableCups, selectedFreeCupsToUse + 1)),
                                  }))
                                }}
                              >
                                +
                              </button>
                              <strong className="order-loyalty-stepper-value">{selectedFreeCupsToUse}</strong>
                              <button
                                type="button"
                                className="order-loyalty-stepper-button"
                                aria-label={language === 'ar' ? 'تقليل عدد الأكواب المجانية' : 'Decrease free cups'}
                                disabled={selectedFreeCupsToUse <= 1}
                                onClick={() => {
                                  setCheckoutForm((current) => ({
                                    ...current,
                                    free_cups_to_use: String(Math.max(1, selectedFreeCupsToUse - 1)),
                                  }))
                                }}
                              >
                                -
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="order-modal-panel order-modal-payment-panel">
              <div className="order-modal-section-heading">
                <div>
                  <p>{t('payment')}</p>
                  <h3>{t('paymentWiring')}</h3>
                </div>
              </div>

              {pendingOrder?.order_number ? (
                <p className="order-payment-order-number">
                  {t('orderNumber')}: <strong>{pendingOrder.order_number}</strong>
                </p>
              ) : null}

              <div className="order-payment-summary">
                <div>
                  <span>{t('totalCups')}</span>
                  <strong>{cartCups}</strong>
                </div>
                <div>
                  <span>{t('totalAmount')}</span>
                  <strong>{money(orderTotal)}</strong>
                </div>
              </div>

              {isPaymentBusy ? (
                <div className="order-payment-status" role="status" aria-live="polite">
                  <span className="order-payment-spinner" aria-hidden="true" />
                  <div>
                    <strong>{paymentStatusTitle}</strong>
                    <p>{paymentStatusBody}</p>
                  </div>
                </div>
              ) : null}

              {orderPayment?.client_secret && stripePromise ? (
                <div className={`stripe-payment-shell${isPaymentBusy ? ' is-busy' : ''}`}>
                  <StripePaymentStep
                    clientSecret={orderPayment.client_secret}
                    stripePromise={stripePromise}
                    paymentConfig={paymentConfig}
                    pendingCheckout={pendingCheckout}
                    payLabel={payLabel}
                    isPaying={isPaymentBusy}
                    onPayStart={handleStripePayStart}
                    onPaySuccess={handleStripePaySuccess}
                    onPayError={handleStripePayError}
                  />
                </div>
              ) : (
                <div className="order-payment-placeholder">
                  <strong>{t('paymentPlaceholder')}</strong>
                  <p>{t('paymentPlaceholderBody')}</p>
                </div>
              )}

              {paymentError ? (
                <p className="field-hint error order-payment-error">{paymentError}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className={`order-modal-footer single-action${step === 3 ? ' payment-step' : ''}`}>
          {step < 3 ? (
            <button
              type="button"
              className="order-modal-primary"
              disabled={
                step === 1
                  ? !canContinueFromProducts
                  : !canContinueFromCheckout || isCreatingOrder
              }
              onClick={() => {
                if (step === 1) {
                  setStep(2)
                  return
                }

                handleContinueToPayment()
              }}
            >
              {step === 1
                ? t('continueCheckout')
                : isCreatingOrder
                  ? t('creatingOrder')
                  : t('continuePayment')}
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  )
}

export default OrderNowModal