'use client'

import { motion } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { FaWeibo, FaInstagram, FaTwitter } from 'react-icons/fa'

const socialLinks = [
  { name: '微博', icon: FaWeibo, href: '#' },
  { name: 'Twitter', icon: FaTwitter, href: '#' },
  { name: 'Instagram', icon: FaInstagram, href: '#' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-dark text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">关于</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              孙颖莎个人官方网站，展示职业生涯、成就和精彩瞬间。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">快速链接</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#about" className="hover:text-gold transition-colors">
                  关于
                </a>
              </li>
              <li>
                <a href="#career" className="hover:text-gold transition-colors">
                  职业生涯
                </a>
              </li>
              <li>
                <a href="#highlights" className="hover:text-gold transition-colors">
                  精彩瞬间
                </a>
              </li>
              <li>
                <a href="#statistics" className="hover:text-gold transition-colors">
                  数据统计
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">社交媒体</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Copyright & Back to Top */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} 孙颖莎. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 text-gray-400 hover:text-gold transition-colors"
          >
            <span className="text-sm">返回顶部</span>
            <FiArrowUp size={20} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
