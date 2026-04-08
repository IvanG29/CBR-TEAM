'use client'
import {
	useState,
	useEffect,
	useRef,
	type ReactNode,
	type FormEvent,
} from 'react'
import { useTheme } from './hooks/useThemes'
import { ThemeButton } from './components/buttonTheme'

// ─── Данные ───
const SERVICES = [
	{
		title: 'Веб-разработка',
		desc: 'Быстрые и адаптивные сайты на Next.js и React.',
		icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
		gradient: 'from-violet-500 to-purple-600',
	},
	{
		title: 'UI/UX Дизайн',
		desc: 'Интуитивные интерфейсы, повышающие конверсию.',
		icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
		gradient: 'from-cyan-500 to-blue-600',
	},
	{
		title: 'SEO & Продвижение',
		desc: 'Выводим сайты в топ. Оптимизация и аналитика.',
		icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
		gradient: 'from-orange-500 to-red-500',
	},
	{
		title: 'Мобильные приложения',
		desc: 'Кроссплатформенные решения на React Native.',
		icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
		gradient: 'from-emerald-500 to-teal-600',
	},
]

// Полностью рабочий PORTFOLIO с картинками
const PORTFOLIO = [
	{
		title: 'SmartHome',

		image: 'src/image/photo_2026-04-05_14-05-16.jpg',
	},
	{
		title: 'FastFood',

		image: 'src/image/photo_2026-04-05_14-05-21.jpg',
	},
	{
		title: 'Webovio',

		image: 'src/image/photo_2026-04-05_14-05-34.jpg',
	},
	{
		title: 'Avion',

		image: 'src/image/photo_2026-04-05_14-05-37.jpg',
	},
	{
		title: 'FastFood',

		image: 'src/image/photo_2026-04-05_14-05-41.jpg',
	},
	{
		title: 'Porsche',

		image: 'src/image/photo_2026-04-08_20-02-04.jpg',
	},
	{
		title: 'Robo School',

		image: 'src/image/Снимок экрана 2026-04-08 202408.png',
	},
	{
		title: 'Kinoarea',

		image: 'src/image/Снимок экрана 2026-04-08 202441.png',
	},
	{
		title: 'D&B',
		image: 'src/image/photo_2026-04-05_14-05-14.jpg',
	},
]
const TESTIMONIALS = [
	{
		name: 'Алексей Петров',
		role: 'CEO, FinGroup',
		text: 'CBR-TEAM полностью переделали наш портал. Скорость выросла в 3 раза, команда довольна.',
		rating: 5,
	},
	{
		name: 'Мария Козлова',
		role: 'Маркетолог, StyleShop',
		text: 'После редизайна конверсия выросла на 340%. Работают быстро и профессионально.',
		rating: 5,
	},
	{
		name: 'Дмитрий Волков',
		role: 'Founder, NeuroAI',
		text: 'Лендинг буквально продаёт за нас. За месяц получили 500+ заявок. Отличный UX.',
		rating: 5,
	},
]

// ─── Хук появления при скролле ───
function useScrollAnimation() {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setIsVisible(true)
			},
			{ threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
		)
		if (ref.current) observer.observe(ref.current)
		return () => observer.disconnect()
	}, [])

	return { ref, isVisible }
}

// ─── Обёртка с плавным появлением ───
function AnimatedSection({
	children,
	className = '',
	delay = 0,
}: {
	children: ReactNode
	className?: string
	delay?: number
}) {
	const { ref, isVisible } = useScrollAnimation()
	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
			} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	)
}

// ─── Glass Card ───
function GlassCard({
	children,
	className = '',
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={`relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 ${className}`}
		>
			<div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none' />
			<div className='relative z-10'>{children}</div>
		</div>
	)
}

// ─── Форма заявки ───
function ContactForm({ isDark }: { isDark: boolean }) {
	const [formData, setFormData] = useState({ name: '', email: '', message: '' })
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submitted, setSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {}
		if (!formData.name.trim()) newErrors.name = 'Введите ваше имя'
		if (!formData.email.trim()) {
			newErrors.email = 'Введите email'
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Некорректный email'
		}
		if (!formData.message.trim()) newErrors.message = 'Опишите ваш проект'
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)

		// Имитация отправки — замените на реальный API/EmailJS/Telegram Bot
		await new Promise(res => setTimeout(res, 1500))

		console.log('Заявка:', formData)
		setLoading(false)
		setSubmitted(true)
		setFormData({ name: '', email: '', message: '' })

		// Сброс сообщения через 5 секунд
		setTimeout(() => setSubmitted(false), 5000)
	}

	if (submitted) {
		return (
			<div className='text-center py-12'>
				<div className='w-16 h-16 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6'>
					<svg
						className='w-8 h-8 text-green-400'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 13l4 4L19 7'
						/>
					</svg>
				</div>
				<h3 className='text-2xl font-bold text-white mb-2'>
					Заявка отправлена!
				</h3>
				<p className='text-gray-400'>Мы свяжемся с вами в ближайшее время.</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-5' noValidate>
			{/* Имя */}
			<div>
				<label
					htmlFor='name'
					className='block text-sm font-medium text-gray-400 mb-2 '
				>
					Ваше имя
				</label>
				<input
					id='name'
					type='text'
					value={formData.name}
					onChange={e => {
						setFormData(prev => ({ ...prev, name: e.target.value }))
						if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
					}}
					placeholder='Иван Иванов'
					className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border backdrop-blur-md placeholder-gray-600 outline-none transition-all duration-300 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 ${
						errors.name
							? 'border-red-500/50 ring-1 ring-red-500/30'
							: 'border-white/10'
					}`}
				/>
				{errors.name && (
					<p className='text-red-400 text-xs mt-1.5'>{errors.name}</p>
				)}
			</div>

			{/* Email */}
			<div>
				<label
					htmlFor='email'
					className='block text-sm font-medium text-gray-400 mb-2'
				>
					Email
				</label>
				<input
					id='email'
					type='email'
					value={formData.email}
					onChange={e => {
						setFormData(prev => ({ ...prev, email: e.target.value }))
						if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
					}}
					placeholder='ivan@example.com'
					className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border backdrop-blur-md text-white placeholder-gray-600 outline-none transition-all duration-300 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 ${
						errors.email
							? 'border-red-500/50 ring-1 ring-red-500/30'
							: 'border-white/10'
					}`}
				/>
				{errors.email && (
					<p className='text-red-400 text-xs mt-1.5'>{errors.email}</p>
				)}
			</div>

			{/* Сообщение */}
			<div>
				<label
					htmlFor='message'
					className='block text-sm font-medium text-gray-400 mb-2'
				>
					Расскажите о проекте
				</label>
				<textarea
					id='message'
					rows={4}
					value={formData.message}
					onChange={e => {
						setFormData(prev => ({ ...prev, message: e.target.value }))
						if (errors.message) setErrors(prev => ({ ...prev, message: '' }))
					}}
					placeholder='Опишите вашу идею, бюджет и сроки...'
					className={`w-full px-4 py-3.5 rounded-xl bg-white/5 border backdrop-blur-md text-white placeholder-gray-600 outline-none transition-all duration-300 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none ${
						errors.message
							? 'border-red-500/50 ring-1 ring-red-500/30'
							: 'border-white/10'
					}`}
				/>
				{errors.message && (
					<p className='text-red-400 text-xs mt-1.5'>{errors.message}</p>
				)}
			</div>

			{/* Кнопка */}
			<button
				type='submit'
				disabled={loading}
				className='w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300'
			>
				{loading ? (
					<>
						<svg
							className='w-5 h-5 animate-spin'
							fill='none'
							viewBox='0 0 24 24'
						>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'
							/>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
							/>
						</svg>
						Отправка...
					</>
				) : (
					<>
						Отправить заявку
						<svg
							className='w-5 h-5'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M14 5l7 7m0 0l-7 7m7-7H3'
							/>
						</svg>
					</>
				)}
			</button>
		</form>
	)
}

// ═══════════════════════════════════════════
// ─── ГЛАВНЫЙ КОМПОНЕНТ ───
// ═══════════════════════════════════════════
export default function App() {
	const { theme, toggleTheme } = useTheme()
	const [menuOpen, setMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const isDark = theme === 'dark'

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const closeMenu = () => setMenuOpen(false)

	return (
		<div
			className={`min-h-screen scroll-smooth ${isDark ? 'bg-[#030303] text-white' : 'bg-[#fafafa] text-gray-900'} selection:bg-violet-500/30`}
		>
			{/* ─── Глобальные стили ─── */}
			<style>{`
        html { scroll-padding-top: 100px; }
        @keyframes float-slow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-24px) scale(1.05); } }
        @keyframes float-delay { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-16px) scale(0.98); } }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 10s ease-in-out 3s infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${isDark ? '#050505' : '#f0f0f0'}; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#222' : '#ccc'}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#333' : '#999'}; }
      `}</style>

			{/* ═══════════════ HEADER ═══════════════ */}
			<header
				className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
					scrolled
						? isDark
							? 'bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50'
							: 'bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-lg shadow-black/5'
						: 'bg-transparent'
				}`}
			>
				<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
					<a href='#' className='flex items-center gap-2 group'>
						<div
							className={`w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300 shadow-lg ${isDark ? 'shadow-purple-500/30' : 'shadow-purple-500/20'}`}
						>
							C
						</div>
						<span className='text-xl font-bold tracking-tight'>
							CBR
							<span className={isDark ? 'text-violet-400' : 'text-violet-600'}>
								-TEAM
							</span>
						</span>
					</a>

					<nav className='hidden md:flex items-center gap-8'>
						{['Услуги', 'Наши работы', 'Отзывы', 'Контакты'].map(item => (
							<a
								key={item}
								href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
								className={`text-sm font-medium relative group transition-colors duration-300 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
							>
								{item}
								<span
									className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isDark ? 'bg-violet-500' : 'bg-violet-600'}`}
								/>
							</a>
						))}
					</nav>

					<div className='flex items-center gap-3'>
						{/* ✅ РАБОЧАЯ СМЕНА ТЕМЫ — используем toggleTheme из useTheme */}
						<ThemeButton theme={theme} toggleTheme={toggleTheme} />

						<a
							href='#контакты'
							className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
								isDark
									? 'bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:border-white/20'
									: 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
							}`}
						>
							Связаться
							<svg
								className='w-4 h-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 8l4 4m0 0l-4 4m4-4H3'
								/>
							</svg>
						</a>

						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
							aria-label='Меню'
						>
							<svg
								className={`w-6 h-6 transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d={
										menuOpen
											? 'M6 18L18 6M6 6l12 12'
											: 'M4 6h16M4 12h16M4 18h16'
									}
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Мобильное меню */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
						menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
					} ${isDark ? 'bg-black/80 border-t border-white/10' : 'bg-white/95 border-t border-gray-200'} backdrop-blur-2xl`}
				>
					<nav className='flex flex-col gap-1 px-6 py-4'>
						{['Услуги', 'Наши работы', 'Отзывы', 'Контакты'].map(item => (
							<a
								key={item}
								href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
								onClick={closeMenu}
								className={`text-lg font-medium py-3 px-4 rounded-xl transition-all duration-200 ${
									isDark
										? 'text-gray-300 hover:text-white hover:bg-white/10'
										: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
								}`}
							>
								{item}
							</a>
						))}
					</nav>
				</div>
			</header>

			<main className='relative z-10'>
				{/* ═══════════════ HERO ═══════════════ */}
				<section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-24'>
					{/* Glowing Orbs */}
					<div
						className={`absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none animate-float-slow ${isDark ? 'bg-violet-600/20' : 'bg-violet-400/10'}`}
					/>
					<div
						className={`absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none animate-float-delay ${isDark ? 'bg-cyan-500/15' : 'bg-cyan-400/10'}`}
					/>

					<div className='relative z-10 max-w-5xl mx-auto px-6 text-center'>
						<div
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-md border transition-all duration-300 ${
								isDark
									? 'bg-white/5 border-white/10 text-violet-300'
									: 'bg-violet-50 border-violet-100 text-violet-700'
							}`}
						>
							<span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
							Принимаем заказы на Q2 2026
						</div>

						<h1 className='text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8'>
							Создаём{' '}
							<span
								className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600'}`}
							>
								цифровые
							</span>
							<br />
							продукты будущего
						</h1>

						<p
							className={`text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
						>
							Мы — команда разработчиков и дизайнеров. Превращаем идеи в
							элегантные решения, которые работают на результат вашего бизнеса.
						</p>

						<div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
							<a
								href='#контакты'
								className='flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg '
							>
								Обсудить проект
								<svg
									className='w-5 h-5 ml-1'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 8l4 4m0 0l-4 4m4-4H3'
									/>
								</svg>
							</a>
							<a
								href='#наши-работы'
								className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-md border transition-all duration-300 hover:-translate-y-1 ${
									isDark
										? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
										: 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
								}`}
							>
								Смотреть работы
							</a>
						</div>

						<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-24 max-w-3xl mx-auto'>
							{[
								{ n: '150+', l: 'Проектов' },
								{ n: '50+', l: 'Клиентов' },
								{ n: '4', l: 'Года опыта' },
								{ n: '99%', l: 'Довольных клиентов' },
							].map((s, i) => (
								<AnimatedSection key={s.l} delay={i * 100}>
									<GlassCard className='p-6'>
										<div
											className={`text-3xl sm:text-4xl font-black bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 to-cyan-600'}`}
										>
											{s.n}
										</div>
										<div
											className={`text-sm mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
										>
											{s.l}
										</div>
									</GlassCard>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>

				{/* ═══════════════ УСЛУГИ ═══════════════ */}
				<section
					id='услуги'
					className={`py-28 px-6 transition-colors duration-500 ${isDark ? '' : 'bg-white'}`}
				>
					<div className='max-w-7xl mx-auto'>
						<AnimatedSection>
							<div className='text-center mb-20'>
								<span
									className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border transition-colors duration-300 ${
										isDark
											? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
											: 'bg-violet-50 text-violet-600 border-violet-100'
									}`}
								>
									Услуги
								</span>
								<h2 className='text-4xl sm:text-6xl font-black tracking-tight mb-6'>
									Что мы{' '}
									<span
										className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 to-cyan-600'}`}
									>
										делаем
									</span>
								</h2>
								<p
									className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
								>
									Полный цикл разработки — от идеи до запуска и поддержки
								</p>
							</div>
						</AnimatedSection>

						<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
							{SERVICES.map((s, i) => (
								<AnimatedSection key={i} delay={i * 100}>
									{isDark ? (
										<GlassCard className='p-8 h-full flex flex-col justify-between group'>
											<div>
												<div
													className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
												>
													<svg
														className='w-7 h-7'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={1.5}
															d={s.icon}
														/>
													</svg>
												</div>
												<h3 className='text-xl font-bold mb-3'>{s.title}</h3>
												<p className='text-sm leading-relaxed text-gray-400'>
													{s.desc}
												</p>
											</div>
										</GlassCard>
									) : (
										<div
											className={`p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
												isDark
													? 'bg-white/[0.03] border-white/10'
													: 'bg-white border-gray-100 hover:border-violet-200'
											}`}
										>
											<div
												className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white mb-6 hover:scale-110 transition-transform duration-300 shadow-lg`}
											>
												<svg
													className='w-7 h-7'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={1.5}
														d={s.icon}
													/>
												</svg>
											</div>
											<h3 className='text-xl font-bold mb-3'>{s.title}</h3>
											<p className='text-sm leading-relaxed text-gray-500'>
												{s.desc}
											</p>
										</div>
									)}
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>

				{/* ═══════════════ ПОРТФОЛИО ═══════════════ */}
				<section
					id='наши-работы'
					className={`py-28 px-6 transition-colors duration-500 ${isDark ? '' : 'bg-gray-50'}`}
				>
					<div className='max-w-7xl mx-auto'>
						<AnimatedSection>
							<div className='text-center mb-20'>
								<span
									className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border transition-colors duration-300 ${
										isDark
											? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
											: 'bg-violet-50 text-violet-600 border-violet-100'
									}`}
								>
									Портфолио
								</span>
								<h2 className='text-4xl sm:text-6xl font-black tracking-tight mb-6'>
									Наши{' '}
									<span
										className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 to-cyan-600'}`}
									>
										работы
									</span>
								</h2>
								<p
									className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
								>
									Проекты, которыми мы гордимся
								</p>
							</div>
						</AnimatedSection>

						<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{PORTFOLIO.map((p) => (
								<AnimatedSection>
									<div className='group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 shadow-2xl'>
										<div className='relative aspect-[4/3] overflow-hidden'>
											{/* КАРТИНКА - всегда чёткая */}
											<img
												src={p.image}
												alt={p.title}
												className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
												loading='lazy'
											/>

											
											<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>

											

											
											<div className='absolute inset-0 p-6 flex flex-col justify-between z-10'>
												{/* УБРАЛ backdrop-blur-md */}
												<span>
													
												</span>
												<div>
													<h3 className='text-2xl font-bold text-white mb-1 drop-shadow-lg'>
														{p.title}
													</h3>
												</div>
											</div>
										</div>

										{/* ОВЕРЛЕЙ ПРИ НАВЕДЕНИИ - ТОЖЕ БЕЗ БЛЮРА */}
										<div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center z-20'>
											{/* УБРАЛ backdrop-blur-md и backdrop-blur-sm */}
											<span className='text-white font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex items-center gap-2 bg-black/60 px-6 py-3 rounded-full border border-white/30'>
												Смотреть кейс
												<svg
													className='w-4 h-4'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M17 8l4 4m0 0l-4 4m4-4H3'
													/>
												</svg>
											</span>
										</div>
									</div>
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>
				{/* ═══════════════ ОТЗЫВЫ ═══════════════ */}
				<section
					id='отзывы'
					className={`py-28 px-6 transition-colors duration-500 ${isDark ? '' : 'bg-white'}`}
				>
					<div className='max-w-7xl mx-auto'>
						<AnimatedSection>
							<div className='text-center mb-20'>
								<span
									className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border transition-colors duration-300 ${
										isDark
											? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
											: 'bg-cyan-50 text-cyan-600 border-cyan-100'
									}`}
								>
									Отзывы
								</span>
								<h2 className='text-4xl sm:text-6xl font-black tracking-tight mb-6'>
									Что говорят{' '}
									<span
										className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 to-cyan-600'}`}
									>
										клиенты
									</span>
								</h2>
							</div>
						</AnimatedSection>
						<div className='grid md:grid-cols-3 gap-8'>
							{TESTIMONIALS.map((t, i) => (
								<AnimatedSection key={i} delay={i * 120}>
									{isDark ? (
										<GlassCard className='p-8 h-full flex flex-col justify-between'>
											<div>
												<div className='flex gap-1 text-amber-400 mb-6'>
													{Array.from({ length: t.rating }).map((_, idx) => (
														<svg
															key={idx}
															className='w-5 h-5'
															fill='currentColor'
															viewBox='0 0 20 20'
														>
															<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
														</svg>
													))}
												</div>
												<p className='text-base leading-relaxed text-gray-300 mb-6 italic'>
													«{t.text}»
												</p>
											</div>
											<div className='flex items-center gap-3 pt-4 border-t border-white/5'>
												<div className='w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold border border-white/10'>
													{t.name[0]}
												</div>
												<div>
													<div className='font-bold text-sm'>{t.name}</div>
													<div className='text-xs text-gray-500'>{t.role}</div>
												</div>
											</div>
										</GlassCard>
									) : (
										<div className='p-8 rounded-2xl border border-gray-100 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col justify-between'>
											<div>
												<div className='flex gap-1 text-amber-400 mb-6'>
													{Array.from({ length: t.rating }).map((_, idx) => (
														<svg
															key={idx}
															className='w-5 h-5'
															fill='currentColor'
															viewBox='0 0 20 20'
														>
															<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
														</svg>
													))}
												</div>
												<p className='text-base leading-relaxed text-gray-600 mb-6 italic'>
													«{t.text}»
												</p>
											</div>
											<div className='flex items-center gap-3 pt-4 border-t border-gray-100'>
												<div className='w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold'>
													{t.name[0]}
												</div>
												<div>
													<div className='font-bold text-sm'>{t.name}</div>
													<div className='text-xs text-gray-400'>{t.role}</div>
												</div>
											</div>
										</div>
									)}
								</AnimatedSection>
							))}
						</div>
					</div>
				</section>

				{/* ═══════════════ КОНТАКТЫ + ФОРМА ЗАЯВКИ ═══════════════ */}
				<section
					id='контакты'
					className={`py-28 px-6 transition-colors duration-500 ${isDark ? '' : 'bg-gray-50'}`}
				>
					<div className='max-w-5xl mx-auto'>
						<AnimatedSection>
							<div className='text-center mb-16'>
								<span
									className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border transition-colors duration-300 ${
										isDark
											? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
											: 'bg-violet-50 text-violet-600 border-violet-100'
									}`}
								>
									Контакты
								</span>
								<h2 className='text-4xl sm:text-6xl font-black tracking-tight mb-6'>
									Начнём{' '}
									<span
										className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-violet-400 to-cyan-400' : 'bg-gradient-to-r from-violet-600 to-cyan-600'}`}
									>
										ваш проект
									</span>
								</h2>
								<p
									className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
								>
									Заполните форму — и мы свяжемся с вами в течение 24 часов
								</p>
							</div>
						</AnimatedSection>

						<div className='grid lg:grid-cols-5 gap-8'>
							{/* Левая колонка — контакты */}
							<AnimatedSection className='lg:col-span-2'>
								{isDark ? (
									<GlassCard className='p-8 h-full'>
										<h3 className='text-xl font-bold mb-6'>Свяжитесь с нами</h3>
										<div className='space-y-6'>
											<a
												href='https://t.me/'
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300'>
													<svg
														className='w-6 h-6 text-sky-400'
														fill='currentColor'
														viewBox='0 0 24 24'
													>
														<path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' />
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Telegram</div>
													<div className='text-xs text-gray-500'>@cbrteam</div>
												</div>
											</a>
											<a
												href='https://discord.gg/'
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300'>
													<svg
														className='w-6 h-6 text-indigo-400'
														fill='currentColor'
														viewBox='0 0 24 24'
													>
														<path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z' />
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Discord</div>
													<div className='text-xs text-gray-500'>
														discord.gg/cbrteam
													</div>
												</div>
											</a>
											<a
												href='mailto:hello@cbrteam.dev'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300'>
													<svg
														className='w-6 h-6 text-violet-400'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={1.5}
															d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
														/>
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Email</div>
													<div className='text-xs text-gray-500'>
														hello@cbrteam.dev
													</div>
												</div>
											</a>
										</div>
									</GlassCard>
								) : (
									<div className='p-8 rounded-2xl border border-gray-100 bg-white h-full transition-colors duration-300'>
										<h3 className='text-xl font-bold mb-6'>Свяжитесь с нами</h3>
										<div className='space-y-6'>
											<a
												href='https://t.me/'
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:shadow-md transition-all duration-300'>
													<svg
														className='w-6 h-6 text-sky-500'
														fill='currentColor'
														viewBox='0 0 24 24'
													>
														<path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' />
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Telegram</div>
													<div className='text-xs text-gray-400'>@cbrteam</div>
												</div>
											</a>
											<a
												href='https://discord.gg/'
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:shadow-md transition-all duration-300'>
													<svg
														className='w-6 h-6 text-indigo-500'
														fill='currentColor'
														viewBox='0 0 24 24'
													>
														<path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z' />
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Discord</div>
													<div className='text-xs text-gray-400'>
														discord.gg/cbrteam
													</div>
												</div>
											</a>
											<a
												href='mailto:hello@cbrteam.dev'
												className='flex items-center gap-4 group'
											>
												<div className='w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:shadow-md transition-all duration-300'>
													<svg
														className='w-6 h-6 text-violet-500'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={1.5}
															d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
														/>
													</svg>
												</div>
												<div>
													<div className='font-semibold text-sm'>Email</div>
													<div className='text-xs text-gray-400'>
														hello@cbrteam.dev
													</div>
												</div>
											</a>
										</div>
									</div>
								)}
							</AnimatedSection>

							{/* Правая колонка — форма заявки */}
							<AnimatedSection className='lg:col-span-3' delay={150}>
								{isDark ? (
									<GlassCard className='p-8 sm:p-10'>
										<ContactForm isDark={isDark} />
									</GlassCard>
								) : (
									<div className='p-8 sm:p-10 rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50 transition-colors duration-300'>
										<ContactForm isDark={isDark} />
									</div>
								)}
							</AnimatedSection>
						</div>
					</div>
				</section>
			</main>

			{/* ═══════════════ FOOTER ═══════════════ */}
			<footer
				className={`border-t transition-colors duration-500 ${isDark ? 'border-white/10 bg-black/40 backdrop-blur-xl' : 'border-gray-100 bg-white'}`}
			>
				<div className='max-w-7xl mx-auto px-6 py-14'>
					<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
						<div className='sm:col-span-2 lg:col-span-1'>
							<div className='flex items-center gap-2 mb-4'>
								<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30'>
									C
								</div>
								<span className='text-lg font-bold'>
									CBR
									<span
										className={isDark ? 'text-violet-400' : 'text-violet-600'}
									>
										-TEAM
									</span>
								</span>
							</div>
							<p
								className={`text-sm leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
							>
								Создаём цифровые продукты, которые меняют правила игры.
							</p>
						</div>
						<div>
							<h4
								className={`font-bold text-xs uppercase tracking-widest mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Навигация
							</h4>
							<ul className='space-y-2'>
								{['Услуги', 'Наши работы', 'Отзывы', 'О нас'].map(l => (
									<li key={l}>
										<a
											href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
											className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
										>
											{l}
										</a>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h4
								className={`font-bold text-xs uppercase tracking-widest mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Услуги
							</h4>
							<ul className='space-y-2'>
								{[
									'Веб-разработка',
									'UI/UX Дизайн',
									'SEO',
									'Мобильные приложения',
								].map(l => (
									<li key={l}>
										<a
											href='#услуги'
											className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
										>
											{l}
										</a>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h4
								className={`font-bold text-xs uppercase tracking-widest mb-4 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
							>
								Контакты
							</h4>
							<ul className='space-y-2'>
								{[
									{ l: 'Telegram', h: 'https://t.me/' },
									{ l: 'Discord', h: 'https://discord.gg/' },
									{ l: 'ВКонтакте', h: 'https://vk.com/' },
								].map(c => (
									<li key={c.l}>
										<a
											href={c.h}
											target='_blank'
											rel='noopener noreferrer'
											className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
										>
											{c.l}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div
						className={`flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4 transition-colors duration-300 ${isDark ? 'border-white/10' : 'border-gray-100'}`}
					>
						<p
							className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
						>
							© 2026 CBR-TEAM. Все права защищены.
						</p>
						<div className='flex gap-6'>
							<a
								href='#'
								className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
							>
								Политика конфиденциальности
							</a>
							<a
								href='#'
								className={`text-sm transition-colors duration-200 ${isDark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
							>
								Условия использования
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
