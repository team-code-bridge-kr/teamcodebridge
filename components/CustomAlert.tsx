'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface AlertProps {
  type: AlertType
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

let showAlertFunction: ((props: AlertProps) => void) | null = null

export const CustomAlert = () => {
  const [alert, setAlert] = useState<AlertProps | null>(null)

  useEffect(() => {
    showAlertFunction = (props: AlertProps) => {
      setAlert(props)
    }

    return () => {
      showAlertFunction = null
    }
  }, [])

  const handleClose = () => {
    if (alert?.onClose) alert.onClose()
    setAlert(null)
  }

  const handleConfirm = () => {
    if (alert?.onConfirm) alert.onConfirm()
    setAlert(null)
  }

  const handleCancel = () => {
    if (alert?.onCancel) alert.onCancel()
    setAlert(null)
  }

  const getIcon = () => {
    switch (alert?.type) {
      case 'success':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      case 'info':
      case 'confirm':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {alert && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={alert.type !== 'confirm' ? handleClose : undefined}
          />

          {/* Alert Dialog */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 flex flex-col items-center">
                {getIcon()}
                <h3 className="mt-4 text-xl font-bold text-gray-900 text-center">
                  {alert.title}
                </h3>
                {alert.message && (
                  <p className="mt-2 text-sm text-gray-600 text-center whitespace-pre-wrap">
                    {alert.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 flex gap-3">
                {alert.type === 'confirm' ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors border border-gray-300"
                    >
                      {alert.cancelText || '취소'}
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      {alert.confirmText || '확인'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    {alert.confirmText || '확인'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Helper functions to show alerts
export const showAlert = {
  success: (title: string, message?: string, onClose?: () => void) => {
    if (showAlertFunction) {
      showAlertFunction({ type: 'success', title, message, onClose })
    }
  },
  error: (title: string, message?: string, onClose?: () => void) => {
    if (showAlertFunction) {
      showAlertFunction({ type: 'error', title, message, onClose })
    }
  },
  warning: (title: string, message?: string, onClose?: () => void) => {
    if (showAlertFunction) {
      showAlertFunction({ type: 'warning', title, message, onClose })
    }
  },
  info: (title: string, message?: string, onClose?: () => void) => {
    if (showAlertFunction) {
      showAlertFunction({ type: 'info', title, message, onClose })
    }
  },
  confirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    if (showAlertFunction) {
      showAlertFunction({
        type: 'confirm',
        title,
        message,
        onConfirm,
        onCancel,
        confirmText,
        cancelText
      })
    }
  }
}

