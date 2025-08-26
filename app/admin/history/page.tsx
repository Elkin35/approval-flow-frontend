// approval_flow_frontend/app/admin/history/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link" // <-- Importar Link
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, User, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { getHistory } from "@/lib/api"

export default function AdminHistoryPage() {
  const [allHistory, setAllHistory] = useState<any[]>([])
  const [filteredHistory, setFilteredHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const data = await getHistory()
        setAllHistory(data)
        setFilteredHistory(data)
      } catch (error) {
        console.error("Failed to fetch history", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleFilter = () => {
    let filtered = [...allHistory]
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.solicitud.titulo.toLowerCase().includes(lowercasedTerm) ||
          entry.usuarioAccion.nombre.toLowerCase().includes(lowercasedTerm) ||
          entry.comentario?.toLowerCase().includes(lowercasedTerm),
      )
    }
    if (actionFilter !== "all") {
      filtered = filtered.filter((entry) => entry.estado.nombre === actionFilter)
    }
    setFilteredHistory(filtered)
  }

  const getActionIcon = (actionName: string) => {
    switch (actionName) {
      case "Aprobado": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Rechazado": return <XCircle className="w-4 h-4 text-red-500" />
      case "Pendiente": return <FileText className="w-4 h-4 text-blue-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionBadge = (actionName: string) => {
    const variants = { Pendiente: "default", Aprobado: "default", Rechazado: "destructive" } as const
    return <Badge variant={variants[actionName as keyof typeof variants] || "secondary"}>{actionName}</Badge>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Historial de Cambios" breadcrumbs={[{ label: "Administración" }, { label: "Historial de Cambios" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div><h2 className="text-3xl font-bold tracking-tight">Historial de Cambios</h2><p className="text-muted-foreground">Registro de todas las acciones en el sistema</p></div>
          <Card>
            <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar por título, usuario, comentario..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" /></div>
                <Select value={actionFilter} onValueChange={setActionFilter}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filtrar por acción" /></SelectTrigger><SelectContent><SelectItem value="all">Todas las acciones</SelectItem><SelectItem value="Pendiente">Pendiente (Creadas)</SelectItem><SelectItem value="Aprobado">Aprobadas</SelectItem><SelectItem value="Rechazado">Rechazadas</SelectItem></SelectContent></Select>
                <Button onClick={handleFilter}><Filter className="w-4 h-4 mr-2" />Filtrar</Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            {isLoading ? (
              <p>Cargando historial...</p>
            ) : filteredHistory.map((entry) => (
              // **LA CORRECCIÓN ESTÁ AQUÍ**
              // Se envuelve la tarjeta en un componente Link (ahora block para que space-y funcione)
              <Link
                href={`/request/${entry.solicitud.id_solicitud}`}
                key={entry.id_historial}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {getActionIcon(entry.estado.nombre)}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2"><h3 className="font-semibold text-sm">{entry.solicitud.titulo}</h3>{getActionBadge(entry.estado.nombre)}</div>
                        <p className="text-sm text-muted-foreground">{entry.comentario}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1"><User className="w-3 h-3" /><span>{entry.usuarioAccion.nombre}</span></span>
                          <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{formatDistanceToNow(new Date(entry.fecha_cambio), { addSuffix: true, locale: es })}</span></span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">ID: {entry.solicitud.id_solicitud.substring(0, 8)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {!isLoading && filteredHistory.length === 0 && (<Card><CardContent className="p-8 text-center"><h3 className="text-lg font-semibold">No se encontraron resultados</h3></CardContent></Card>)}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}