"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Send, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getRequestTypes, getUsers, createRequest, createRequestType } from "@/lib/api"
import { useRouter } from "next/navigation"

export function NewRequestForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [requestTypes, setRequestTypes] = useState<any[]>([])
  const [approvers, setApprovers] = useState<any[]>([])
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    id_tipo: "",
    id_aprobador: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, users] = await Promise.all([getRequestTypes(), getUsers()])
        setRequestTypes(types)
        setApprovers(users.filter((u: any) => u.id_usuario !== user?.id_usuario))
      } catch (error) {
        console.error("Failed to fetch initial data for form", error)
      }
    }
    if (user) {
      fetchData()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        id_tipo: parseInt(formData.id_tipo, 10),
        id_aprobador: parseInt(formData.id_aprobador, 10),
      }

      if (!payload.id_tipo || !payload.id_aprobador) {
        alert("Debes seleccionar un tipo y un aprobador.");
        setIsSubmitting(false);
        return;
      }
      
      const ok = await createRequest(payload)
      
      if (ok) {
        router.push("/my-requests")
      }
    } catch (error) {
      console.error("Failed to create request", error)
      alert("Error al crear la solicitud. Revisa los campos.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateType = async () => {
    if (newTypeName.trim()) {
      try {
        const newType = await createRequestType({ nombre: newTypeName.trim() })
        setRequestTypes([...requestTypes, newType])
        setFormData(prev => ({ ...prev, id_tipo: String(newType.id_tipo) }))
        setNewTypeName("")
        setIsTypeDialogOpen(false)
      } catch (error: any) {
        console.error("Failed to create request type", error)
        alert(`Error: ${error.message}`)
      }
    }
  }

  return (
    // --- INICIO DE LA CORRECCIÓN ---
    // Se ha añadido 'flex flex-col items-center' al div principal para centrar su contenido.
    // 'w-full' asegura que el contenedor ocupe todo el ancho disponible para que el centrado funcione.
    <div className="flex w-full flex-col items-center space-y-6 p-6">
      <div className="flex w-full max-w-2xl items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" />Volver al Dashboard</Link>
        </Button>
      </div>
      
      {/* Contenedor para el título y la descripción, ahora centrado */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Nueva Solicitud</h1>
        <p className="text-muted-foreground">Crea una nueva solicitud de aprobación</p>
      </div>

      {/* El formulario se mantiene con un ancho máximo para no estirarse demasiado */}
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Solicitud</CardTitle>
            <CardDescription>Completa todos los campos para crear tu solicitud</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2"><Label htmlFor="title">Título *</Label><Input id="title" placeholder="Ej: Solicitud de vacaciones" value={formData.titulo} onChange={(e) => handleInputChange("titulo", e.target.value)} required /></div>
              {/* Descripción */}
              <div className="space-y-2"><Label htmlFor="description">Descripción *</Label><Textarea id="description" placeholder="Describe los detalles..." rows={4} value={formData.descripcion} onChange={(e) => handleInputChange("descripcion", e.target.value)} required /></div>
              {/* Tipo de Solicitud */}
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                  <Label htmlFor="type">Tipo de Solicitud *</Label>
                  <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
                    <DialogTrigger asChild><Button type="button" variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Agregar Tipo</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Agregar Nuevo Tipo</DialogTitle><DialogDescription>Ingresa el nombre del nuevo tipo</DialogDescription></DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="newType">Nombre del Tipo</Label><Input id="newType" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} required /></div>
                        <div className="flex gap-2">
                          <Button type="button" onClick={handleCreateType}>Agregar</Button>
                          <Button type="button" variant="outline" onClick={() => setIsTypeDialogOpen(false)}>Cancelar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select value={formData.id_tipo} onValueChange={(value) => handleInputChange("id_tipo", value)} required>
                  <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                  <SelectContent>{requestTypes.map((type) => (<SelectItem key={type.id_tipo} value={String(type.id_tipo)}>{type.nombre}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              {/* Solicitante */}
              <div className="space-y-2"><Label htmlFor="requester">Solicitante</Label><Input id="requester" value={`${user?.nombre} (${user?.email})`} disabled className="bg-muted" /></div>
              
              <div className="space-y-2">
                <Label htmlFor="approver">Responsable de Aprobación *</Label>
                <Select value={formData.id_aprobador} onValueChange={(value) => handleInputChange("id_aprobador", value)} required>
                  <SelectTrigger id="approver">
                    <SelectValue placeholder="Selecciona un aprobador" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvers.map((approver) => (
                      <SelectItem key={approver.id_usuario} value={String(approver.id_usuario)}>
                        {approver.nombre} ({approver.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Botones de envío */}
              <div className="flex gap-4 pt-4"><Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={isSubmitting}><Send className="w-4 h-4 mr-2" />{isSubmitting ? "Enviando..." : "Enviar Solicitud"}</Button><Button type="button" variant="outline" asChild><Link href="/">Cancelar</Link></Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* --- FIN DE LA CORRECCIÓN --- */}
    </div>
  )
}