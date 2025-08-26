// approval_flow_frontend/app/assigned-to-me/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, FileText, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { getAssignedToMe } from "@/lib/api"
import { format } from 'date-fns'

function getStatusBadge(status: string) {
  switch (status) {
    case "Pendiente": return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
    case "Aprobado": return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>
    case "Rechazado": return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export default function AssignedToMePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const data = await getAssignedToMe()
        setRequests(data)
      } catch (error) {
        console.error("Failed to fetch assigned requests", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Asignadas a Mí" breadcrumbs={[{ label: "Asignadas a Mí" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Asignadas a Mí</h1>
              <p className="text-muted-foreground">Todas las solicitudes donde eres o has sido responsable de la aprobación.</p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historial de Solicitudes Asignadas</CardTitle>
              <CardDescription>Aquí puedes ver todas las solicitudes que te han sido asignadas, sin importar su estado, para fines de trazabilidad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (<p>Cargando solicitudes...</p>) : requests.length === 0 ? (<p>No se te ha asignado ninguna solicitud.</p>) : (
                requests.map((request) => (
                  <div key={request.id_solicitud} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{request.titulo}</h4>
                        {getStatusBadge(request.estadoActual.nombre)}
                      </div>
                      <p className="text-sm text-muted-foreground">{request.descripcion}</p>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />Solicitante: {request.solicitante.nombre}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(request.fecha_creacion), 'dd/MM/yyyy')}</span>
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{request.tipo.nombre}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/request/${request.id_solicitud}`}><Eye className="w-4 h-4" /></Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}