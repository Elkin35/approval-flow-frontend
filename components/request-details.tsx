// approval_flow_frontend/components/request-details.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Calendar, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getRequestById, updateRequestStatus } from "@/lib/api"
import { useAuth } from "./auth-provider"
import { format } from "date-fns"
import { AppHeader } from "./app-header" // Importamos AppHeader

const ESTADO_APROBADO_ID = 2;
const ESTADO_RECHAZADO_ID = 3;

function getStatusBadge(status: string) {
  // ... (función sin cambios)
  switch (status) {
    case "Pendiente": return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>
    case "Aprobado": return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</Badge>
    case "Rechazado": return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rechazado</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}

export function RequestDetails({ requestId }: { requestId: string }) {
  const { user } = useAuth()
  const [request, setRequest] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchRequest = async () => {
    try {
      // No necesitamos setIsLoading(true) aquí para evitar parpadeos al recargar
      const data = await getRequestById(requestId)
      setRequest(data)
    } catch (error) {
      console.error("Failed to fetch request details", error)
      setRequest(null) // Si falla, limpiamos la solicitud
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (requestId) {
      fetchRequest()
    }
  }, [requestId])
  
  const handleAction = async (id_nuevo_estado: number) => {
    setIsProcessing(true);
    try {
        await updateRequestStatus(requestId, { id_nuevo_estado, comentario: comment });
        setComment("");
        fetchRequest();
    } catch (error) {
        console.error("Failed to update status", error);
    } finally {
        setIsProcessing(false);
    }
  };
  
  // **CORRECCIÓN:** Renderizamos el AppHeader DENTRO del componente cliente
  return (
    <>
      <AppHeader
        title="Detalles de Solicitud"
        breadcrumbs={[
          { label: "Solicitudes" }, 
          { label: request ? request.titulo : `ID: ${requestId.substring(0,8)}...` }
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {isLoading ? (<p>Cargando detalles...</p>) : !request ? (<p>No se encontró la solicitud.</p>) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{request.titulo}</CardTitle>
                    {getStatusBadge(request.estadoActual.nombre)}
                  </div>
                  <CardDescription>ID: {request.id_solicitud}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div><Label className="font-medium text-muted-foreground">Descripción</Label><p>{request.descripcion}</p></div>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                    <div><Label className="font-medium text-muted-foreground">Tipo</Label><p className="flex items-center gap-1"><FileText className="w-4 h-4" />{request.tipo.nombre}</p></div>
                    <div><Label className="font-medium text-muted-foreground">Fecha de Creación</Label><p className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(request.fecha_creacion), "dd/MM/yyyy HH:mm")}</p></div>
                    <div><Label className="font-medium text-muted-foreground">Solicitante</Label><p className="flex items-center gap-1"><User className="w-4 h-4" />{request.solicitante.nombre}</p></div>
                    <div><Label className="font-medium text-muted-foreground">Responsables</Label><p className="flex items-center gap-1"><User className="w-4 h-4" />{request.aprobadores.map((a: any) => a.nombre).join(', ')}</p></div>
                  </div>
                </CardContent>
              </Card>

              {request.aprobadores.some((ap: any) => ap.id_usuario === user?.id_usuario) && request.estadoActual.nombre === "Pendiente" && (
                <Card>
                  <CardHeader><CardTitle>Acciones</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div><Label htmlFor="comment">Comentario</Label><Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
                    <div className="flex gap-3">
                      <Button onClick={() => handleAction(ESTADO_APROBADO_ID)} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" />{isProcessing ? "Procesando..." : "Aprobar"}</Button>
                      <Button onClick={() => handleAction(ESTADO_RECHAZADO_ID)} disabled={isProcessing} variant="destructive"><XCircle className="w-4 h-4 mr-2" />{isProcessing ? "Procesando..." : "Rechazar"}</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-4 h-4" />Historial</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">{request.historial.map((entry: any, index: number) => (<div key={entry.id_historial} className="relative">{index !== request.historial.length - 1 && (<div className="absolute left-2 top-8 bottom-0 w-px bg-border" />)}<div className="flex gap-3"><div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 mt-1" /><div>{getStatusBadge(entry.estado.nombre)}<p className="text-sm">{entry.comentario}</p><div className="text-xs text-muted-foreground"><p>{entry.usuarioAccion.nombre}</p><p>{format(new Date(entry.fecha_cambio), "dd/MM/yyyy HH:mm")}</p></div></div></div></div>))}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  )
}