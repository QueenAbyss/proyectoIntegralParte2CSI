"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Sparkles, Wand2, Crown } from "lucide-react"

interface RegisterFormProps {
  onClose: () => void
}

export function RegisterForm({ onClose }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    semestre: "",
    usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "student"
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validación en tiempo real para algunos campos
    if (field === "email" && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        setErrors(prev => ({ ...prev, [field]: "El email no tiene un formato válido" }))
      } else {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    } else if (field === "password" && value) {
      if (value.length < 6) {
        setErrors(prev => ({ ...prev, [field]: "La contraseña debe tener al menos 6 caracteres" }))
      } else if (!/(?=.*[a-zA-Z])/.test(value)) {
        setErrors(prev => ({ ...prev, [field]: "La contraseña debe contener al menos una letra" }))
      } else if (!/(?=.*\d)/.test(value)) {
        setErrors(prev => ({ ...prev, [field]: "La contraseña debe contener al menos un número" }))
      } else {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    } else if (field === "confirmPassword" && value) {
      if (formData.password !== value) {
        setErrors(prev => ({ ...prev, [field]: "Las contraseñas no coinciden" }))
      } else {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    } else {
      // Limpiar error cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validaciones obligatorias
    if (!formData.nombre1.trim()) {
      newErrors.nombre1 = "El primer nombre es obligatorio"
    } else if (formData.nombre1.trim().length < 2) {
      newErrors.nombre1 = "El nombre debe tener al menos 2 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre1.trim())) {
      newErrors.nombre1 = "El nombre solo puede contener letras"
    }

    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = "El primer apellido es obligatorio"
    } else if (formData.apellido1.trim().length < 2) {
      newErrors.apellido1 = "El apellido debe tener al menos 2 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido1.trim())) {
      newErrors.apellido1 = "El apellido solo puede contener letras"
    }

    // Validaciones opcionales
    if (formData.nombre2.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre2.trim())) {
      newErrors.nombre2 = "El segundo nombre solo puede contener letras"
    }

    if (formData.apellido2.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido2.trim())) {
      newErrors.apellido2 = "El segundo apellido solo puede contener letras"
    }

    if (!formData.semestre) {
      newErrors.semestre = "El semestre es obligatorio"
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es obligatorio"
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es obligatorio"
    } else if (formData.usuario.trim().length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres"
    } else if (formData.usuario.trim().length > 20) {
      newErrors.usuario = "El usuario no puede tener más de 20 caracteres"
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.usuario.trim())) {
      newErrors.usuario = "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "El email no tiene un formato válido"
    } else if (formData.email.trim().length > 100) {
      newErrors.email = "El email no puede tener más de 100 caracteres"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    } else if (formData.password.length > 50) {
      newErrors.password = "La contraseña no puede tener más de 50 caracteres"
    } else if (!/(?=.*[a-zA-Z])/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una letra"
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos un número"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña es obligatorio"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simular envío (por ahora no se guarda en BD)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la lógica para enviar al backend Spring Boot
    console.log("Datos del registro:", formData)
    
    setIsLoading(false)
    alert("¡Registro exitoso! (Por ahora solo frontend)")
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombres */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="nombre1" className="text-sm font-semibold text-gray-700">
            Primer Nombre *
          </Label>
          <Input
            id="nombre1"
            value={formData.nombre1}
            onChange={(e) => handleInputChange("nombre1", e.target.value)}
            placeholder="Ej: María"
            className={errors.nombre1 ? 'border-red-300' : ''}
            required
          />
          {errors.nombre1 && <p className="text-red-500 text-xs">{errors.nombre1}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nombre2" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Segundo Nombre
          </Label>
          <Input
            id="nombre2"
            value={formData.nombre2}
            onChange={(e) => handleInputChange("nombre2", e.target.value)}
            placeholder="Ej: Elena"
            className=""
          />
        </div>
      </div>

      {/* Apellidos */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="apellido1" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Primer Apellido *
          </Label>
          <Input
            id="apellido1"
            value={formData.apellido1}
            onChange={(e) => handleInputChange("apellido1", e.target.value)}
            placeholder="Ej: García"
            className=""
            required
          />
          {errors.apellido1 && <p className="text-red-500 text-xs">{errors.apellido1}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apellido2" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Segundo Apellido
          </Label>
          <Input
            id="apellido2"
            value={formData.apellido2}
            onChange={(e) => handleInputChange("apellido2", e.target.value)}
            placeholder="Ej: López"
            className=""
          />
        </div>
      </div>

      {/* Semestre */}
      <div className="space-y-2">
        <Label htmlFor="semestre" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Semestre Actual *
        </Label>
        <Select value={formData.semestre} onValueChange={(value) => handleInputChange("semestre", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu semestre" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(semestre => (
              <SelectItem key={semestre} value={semestre.toString()}>
                {semestre}° Semestre
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.semestre && <p className="text-red-500 text-xs">{errors.semestre}</p>}
      </div>

      {/* Rol */}
      <div className="space-y-2">
        <Label htmlFor="rol" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Tipo de Usuario *
        </Label>
        <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">
              🧚‍♀️ Estudiante
            </SelectItem>
            <SelectItem value="teacher">
              🧚‍♂️ Profesor
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.rol && <p className="text-red-500 text-xs">{errors.rol}</p>}
      </div>

      {/* Usuario */}
      <div className="space-y-2">
        <Label htmlFor="usuario" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Nombre de Usuario *
        </Label>
        <Input
          id="usuario"
          value={formData.usuario}
          onChange={(e) => handleInputChange("usuario", e.target.value)}
          placeholder="Ej: maria.garcia"
          className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
          required
        />
        {errors.usuario && <p className="text-red-500 text-xs">{errors.usuario}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Correo Electrónico *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="tu@universidad.edu.co"
          className={`border-purple-200 focus:border-purple-400 focus:ring-purple-200 ${
            errors.email ? 'border-red-300 focus:border-red-400' : 
            formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? 'border-green-300' : ''
          }`}
          required
        />
        {errors.email && <p className="text-red-500 text-xs flex items-center gap-1">
          <span>❌</span> {errors.email}
        </p>}
        {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && !errors.email && (
          <p className="text-green-500 text-xs flex items-center gap-1">
            <span>✅</span> Email válido
          </p>
        )}
      </div>

      {/* Contraseñas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Contraseña *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••"
              className={`pr-10 border-purple-200 focus:border-purple-400 focus:ring-purple-200 ${
                errors.password ? 'border-red-300 focus:border-red-400' : 
                formData.password && formData.password.length >= 6 && /(?=.*[a-zA-Z])/.test(formData.password) && /(?=.*\d)/.test(formData.password) ? 'border-green-300' : ''
              }`}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-red-500 text-xs flex items-center gap-1">
            <span>❌</span> {errors.password}
          </p>}
          {formData.password && formData.password.length >= 6 && /(?=.*[a-zA-Z])/.test(formData.password) && /(?=.*\d)/.test(formData.password) && !errors.password && (
            <p className="text-green-500 text-xs flex items-center gap-1">
              <span>✅</span> Contraseña segura
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-purple-700 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Confirmar Contraseña *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className={`pr-10 border-purple-200 focus:border-purple-400 focus:ring-purple-200 ${
                errors.confirmPassword ? 'border-red-300 focus:border-red-400' : 
                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300' : ''
              }`}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs flex items-center gap-1">
            <span>❌</span> {errors.confirmPassword}
          </p>}
          {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
            <p className="text-green-500 text-xs flex items-center gap-1">
              <span>✅</span> Contraseñas coinciden
            </p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>🧚‍♀️ Creando cuenta...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>✨ Crear Cuenta ✨</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}
