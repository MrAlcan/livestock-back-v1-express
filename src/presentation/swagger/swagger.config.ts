import { SwaggerDefinition } from 'swagger-jsdoc';

export const swaggerSpec: SwaggerDefinition & { paths: any } = {
  openapi: '3.0.0',
  info: {
    title: 'SGG - Sistema de Gestión Ganadera API',
    version: '1.0.0',
    description: 'API REST para la gestión integral de ganado bovino. Sistema completo de manejo ganadero con trazabilidad, salud, reproducción y finanzas.',
    contact: {
      name: 'SGG Team',
      email: 'support@sgg.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Servidor de desarrollo',
    },
    {
      url: 'https://api.sgg.com/api/v1',
      description: 'Servidor de producción',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido del endpoint /auth/login',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Error en la validación' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@test.com' },
          password: { type: 'string', format: 'password', example: 'Admin123!' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName', 'farmCode'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          farmCode: { type: 'string' },
          roleCode: { type: 'string', example: 'USER' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
      },
      Animal: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          earTag: { type: 'string', example: 'AR001' },
          name: { type: 'string', example: 'Vaquita Feliz' },
          breed: { type: 'string', example: 'ANGUS' },
          sex: { type: 'string', enum: ['MALE', 'FEMALE'] },
          birthDate: { type: 'string', format: 'date' },
          weight: { type: 'number', example: 450.5 },
          status: { type: 'string', example: 'ACTIVE' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth', description: 'Autenticación y autorización' },
    { name: 'Animals', description: 'Gestión de ganado' },
    { name: 'Events', description: 'Eventos del ganado' },
    { name: 'Health', description: 'Registros de salud' },
    { name: 'Lots', description: 'Gestión de lotes' },
    { name: 'Reproduction', description: 'Servicios reproductivos' },
    { name: 'SENASAG', description: 'Certificados y regulaciones' },
    { name: 'Finance', description: 'Transacciones financieras' },
    { name: 'Sync', description: 'Sincronización offline' },
    { name: 'Admin', description: 'Administración' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': { description: 'Datos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        description: 'Autenticarse y obtener tokens JWT',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login exitoso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refrescar token',
        description: 'Obtener un nuevo access token usando el refresh token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Token refrescado' },
          '401': { description: 'Token inválido' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener perfil actual',
        description: 'Obtiene la información del usuario autenticado',
        responses: {
          '200': { description: 'Perfil de usuario' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/animals': {
      get: {
        tags: ['Animals'],
        summary: 'Listar animales',
        description: 'Obtiene lista de animales con filtros y paginación',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'breed', in: 'query', schema: { type: 'string' } },
          { name: 'sex', in: 'query', schema: { type: 'string', enum: ['MALE', 'FEMALE'] } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Lista de animales',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/Animal' } },
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Animals'],
        summary: 'Crear animal',
        description: 'Registra un nuevo animal en el sistema',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['earTag', 'breed', 'sex', 'birthDate'],
                properties: {
                  earTag: { type: 'string' },
                  name: { type: 'string' },
                  breed: { type: 'string' },
                  sex: { type: 'string', enum: ['MALE', 'FEMALE'] },
                  birthDate: { type: 'string', format: 'date' },
                  weight: { type: 'number' },
                  motherId: { type: 'string' },
                  fatherId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Animal creado' },
          '400': { description: 'Datos inválidos' },
        },
      },
    },
    '/animals/{id}': {
      get: {
        tags: ['Animals'],
        summary: 'Obtener animal por ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Datos del animal' },
          '404': { description: 'Animal no encontrado' },
        },
      },
      put: {
        tags: ['Animals'],
        summary: 'Actualizar animal',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Animal' } } },
        },
        responses: {
          '200': { description: 'Animal actualizado' },
          '404': { description: 'Animal no encontrado' },
        },
      },
      delete: {
        tags: ['Animals'],
        summary: 'Eliminar animal',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Animal eliminado' },
          '404': { description: 'Animal no encontrado' },
        },
      },
    },
    '/events': {
      get: {
        tags: ['Events'],
        summary: 'Listar eventos',
        description: 'Obtiene eventos con filtros',
        parameters: [
          { name: 'animalId', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': { description: 'Lista de eventos' },
        },
      },
      post: {
        tags: ['Events'],
        summary: 'Registrar evento',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['animalId', 'eventType', 'date'],
                properties: {
                  animalId: { type: 'string' },
                  eventType: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  description: { type: 'string' },
                  metadata: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Evento registrado' },
        },
      },
    },
    '/health/products': {
      get: {
        tags: ['Health'],
        summary: 'Listar productos veterinarios',
        responses: { '200': { description: 'Lista de productos' } },
      },
      post: {
        tags: ['Health'],
        summary: 'Crear producto veterinario',
        responses: { '201': { description: 'Producto creado' } },
      },
    },
    '/health/products/{id}': {
      get: {
        tags: ['Health'],
        summary: 'Obtener detalles de producto',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles del producto' } },
      },
      put: {
        tags: ['Health'],
        summary: 'Actualizar producto',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Producto actualizado' } },
      },
    },
    '/health/products/{id}/deactivate': {
      patch: {
        tags: ['Health'],
        summary: 'Desactivar producto',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Producto desactivado' } },
      },
    },
    '/health/products/low-stock': {
      get: {
        tags: ['Health'],
        summary: 'Productos con bajo inventario',
        responses: { '200': { description: 'Lista de productos con bajo stock' } },
      },
    },
    '/health/products/{id}/stock': {
      get: {
        tags: ['Health'],
        summary: 'Verificar stock de producto',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Stock del producto' } },
      },
    },
    '/health/products/{productId}/withdrawal/{animalId}': {
      get: {
        tags: ['Health'],
        summary: 'Verificar período de retiro',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'animalId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Información del período de retiro' } },
      },
    },
    '/health/products/inventory': {
      post: {
        tags: ['Health'],
        summary: 'Registrar movimiento de inventario',
        responses: { '201': { description: 'Movimiento registrado' } },
      },
    },
    '/health/tasks': {
      get: {
        tags: ['Health'],
        summary: 'Listar tareas de salud',
        responses: { '200': { description: 'Lista de tareas' } },
      },
      post: {
        tags: ['Health'],
        summary: 'Crear tarea de salud',
        responses: { '201': { description: 'Tarea creada' } },
      },
    },
    '/health/tasks/{id}': {
      get: {
        tags: ['Health'],
        summary: 'Obtener detalles de tarea',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles de la tarea' } },
      },
      put: {
        tags: ['Health'],
        summary: 'Actualizar tarea',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Tarea actualizada' } },
      },
    },
    '/health/tasks/{id}/complete': {
      patch: {
        tags: ['Health'],
        summary: 'Completar tarea',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Tarea completada' } },
      },
    },
    '/health/tasks/{id}/cancel': {
      patch: {
        tags: ['Health'],
        summary: 'Cancelar tarea',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Tarea cancelada' } },
      },
    },
    '/health/tasks/overdue': {
      get: {
        tags: ['Health'],
        summary: 'Tareas vencidas',
        responses: { '200': { description: 'Lista de tareas vencidas' } },
      },
    },
    '/health/rations': {
      get: {
        tags: ['Health'],
        summary: 'Listar raciones',
        responses: { '200': { description: 'Lista de raciones' } },
      },
      post: {
        tags: ['Health'],
        summary: 'Crear ración',
        responses: { '201': { description: 'Ración creada' } },
      },
    },
    '/health/rations/{id}': {
      get: {
        tags: ['Health'],
        summary: 'Obtener detalles de ración',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles de la ración' } },
      },
      put: {
        tags: ['Health'],
        summary: 'Actualizar ración',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Ración actualizada' } },
      },
    },
    '/health/rations/{id}/ingredients': {
      post: {
        tags: ['Health'],
        summary: 'Agregar ingrediente a ración',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '201': { description: 'Ingrediente agregado' } },
      },
    },
    '/health/rations/assign-lot': {
      post: {
        tags: ['Health'],
        summary: 'Asignar ración a lote',
        responses: { '201': { description: 'Ración asignada' } },
      },
    },
    '/lots': {
      get: {
        tags: ['Lots'],
        summary: 'Listar lotes',
        responses: { '200': { description: 'Lista de lotes' } },
      },
      post: {
        tags: ['Lots'],
        summary: 'Crear lote',
        responses: { '201': { description: 'Lote creado' } },
      },
    },
    '/reproduction/service': {
      post: {
        tags: ['Reproduction'],
        summary: 'Registrar servicio reproductivo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['femaleId', 'maleId', 'serviceDate', 'method'],
                properties: {
                  femaleId: { type: 'string', format: 'uuid' },
                  maleId: { type: 'string', format: 'uuid' },
                  serviceDate: { type: 'string', format: 'date-time' },
                  method: { type: 'string', enum: ['NATURAL', 'ARTIFICIAL'] },
                  observations: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Servicio registrado' } },
      },
    },
    '/reproduction/diagnosis': {
      post: {
        tags: ['Reproduction'],
        summary: 'Registrar diagnóstico',
        responses: { '201': { description: 'Diagnóstico registrado' } },
      },
    },
    '/reproduction/birth': {
      post: {
        tags: ['Reproduction'],
        summary: 'Registrar parto',
        responses: { '201': { description: 'Parto registrado' } },
      },
    },
    '/reproduction/weaning': {
      post: {
        tags: ['Reproduction'],
        summary: 'Registrar destete',
        responses: { '201': { description: 'Destete registrado' } },
      },
    },
    '/reproduction/cycles': {
      get: {
        tags: ['Reproduction'],
        summary: 'Listar ciclos reproductivos',
        responses: { '200': { description: 'Lista de ciclos' } },
      },
    },
    '/reproduction/stats': {
      get: {
        tags: ['Reproduction'],
        summary: 'Estadísticas reproductivas',
        responses: { '200': { description: 'Estadísticas de la finca' } },
      },
    },
    '/reproduction/cycles/{femaleId}': {
      get: {
        tags: ['Reproduction'],
        summary: 'Obtener ciclo por hembra',
        parameters: [
          { name: 'femaleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Ciclo de la hembra' } },
      },
    },
    '/reproduction/performance/{femaleId}': {
      get: {
        tags: ['Reproduction'],
        summary: 'Calcular rendimiento reproductivo',
        parameters: [
          { name: 'femaleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Rendimiento de la hembra' } },
      },
    },
    '/senasag/gma': {
      get: {
        tags: ['SENASAG'],
        summary: 'Listar GMAs (Guías de Movimiento Animal)',
        description: 'Obtiene la lista de guías de movimiento animal con filtros',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de GMAs' } },
      },
      post: {
        tags: ['SENASAG'],
        summary: 'Crear GMA',
        description: 'Crea una nueva guía de movimiento animal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['originFarmId', 'transporterId', 'destinationId', 'type'],
                properties: {
                  originFarmId: { type: 'string', format: 'uuid' },
                  transporterId: { type: 'string', format: 'uuid' },
                  destinationId: { type: 'string', format: 'uuid' },
                  type: { type: 'string' },
                  estimatedArrivalDate: { type: 'string', format: 'date-time' },
                  route: { type: 'string' },
                  distanceKm: { type: 'number' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'GMA creado' } },
      },
    },
    '/senasag/gma/{id}': {
      get: {
        tags: ['SENASAG'],
        summary: 'Obtener detalles de GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles del GMA' } },
      },
    },
    '/senasag/gma/{id}/approve': {
      patch: {
        tags: ['SENASAG'],
        summary: 'Aprobar GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'GMA aprobado' } },
      },
    },
    '/senasag/gma/{id}/reject': {
      patch: {
        tags: ['SENASAG'],
        summary: 'Rechazar GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'GMA rechazado' } },
      },
    },
    '/senasag/gma/{id}/transit': {
      patch: {
        tags: ['SENASAG'],
        summary: 'Marcar GMA en tránsito',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'GMA marcado en tránsito' } },
      },
    },
    '/senasag/gma/{id}/close': {
      patch: {
        tags: ['SENASAG'],
        summary: 'Cerrar GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'GMA cerrado' } },
      },
    },
    '/senasag/gma/{id}/animals': {
      get: {
        tags: ['SENASAG'],
        summary: 'Listar animales del GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Lista de animales' } },
      },
      post: {
        tags: ['SENASAG'],
        summary: 'Agregar animal al GMA',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '201': { description: 'Animal agregado' } },
      },
    },
    '/senasag/documents': {
      get: {
        tags: ['SENASAG'],
        summary: 'Listar documentos regulatorios',
        responses: { '200': { description: 'Lista de documentos' } },
      },
      post: {
        tags: ['SENASAG'],
        summary: 'Crear documento regulatorio',
        responses: { '201': { description: 'Documento creado' } },
      },
    },
    '/senasag/documents/expiring': {
      get: {
        tags: ['SENASAG'],
        summary: 'Documentos próximos a vencer',
        responses: { '200': { description: 'Lista de documentos próximos a vencer' } },
      },
    },
    '/senasag/documents/{id}/status': {
      patch: {
        tags: ['SENASAG'],
        summary: 'Actualizar estado de documento',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Estado actualizado' } },
      },
    },
    '/finance/movements': {
      get: {
        tags: ['Finance'],
        summary: 'Listar movimientos financieros',
        description: 'Obtiene lista de movimientos con filtros',
        responses: { '200': { description: 'Lista de movimientos' } },
      },
      post: {
        tags: ['Finance'],
        summary: 'Registrar movimiento financiero',
        responses: { '201': { description: 'Movimiento registrado' } },
      },
    },
    '/finance/movements/{id}': {
      get: {
        tags: ['Finance'],
        summary: 'Obtener detalles de movimiento',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles del movimiento' } },
      },
    },
    '/finance/movements/{id}/approve': {
      patch: {
        tags: ['Finance'],
        summary: 'Aprobar movimiento',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Movimiento aprobado' } },
      },
    },
    '/finance/movements/{id}/payment': {
      patch: {
        tags: ['Finance'],
        summary: 'Marcar como pagado',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Movimiento marcado como pagado' } },
      },
    },
    '/finance/movements/{id}/cancel': {
      patch: {
        tags: ['Finance'],
        summary: 'Cancelar movimiento',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Movimiento cancelado' } },
      },
    },
    '/finance/movements/overdue': {
      get: {
        tags: ['Finance'],
        summary: 'Pagos vencidos',
        responses: { '200': { description: 'Lista de pagos vencidos' } },
      },
    },
    '/finance/reports/profit': {
      get: {
        tags: ['Finance'],
        summary: 'Calcular rentabilidad',
        description: 'Calcula la rentabilidad de la finca en un período',
        responses: { '200': { description: 'Reporte de rentabilidad' } },
      },
    },
    '/finance/reports/lot-profitability/{lotId}': {
      get: {
        tags: ['Finance'],
        summary: 'Rentabilidad por lote',
        parameters: [
          { name: 'lotId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Rentabilidad del lote' } },
      },
    },
    '/finance/third-parties': {
      get: {
        tags: ['Finance'],
        summary: 'Listar terceros',
        description: 'Lista de proveedores, clientes y otros terceros',
        responses: { '200': { description: 'Lista de terceros' } },
      },
      post: {
        tags: ['Finance'],
        summary: 'Crear tercero',
        responses: { '201': { description: 'Tercero creado' } },
      },
    },
    '/finance/third-parties/{id}': {
      get: {
        tags: ['Finance'],
        summary: 'Obtener detalles de tercero',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Detalles del tercero' } },
      },
      put: {
        tags: ['Finance'],
        summary: 'Actualizar tercero',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Tercero actualizado' } },
      },
    },
    '/finance/categories': {
      get: {
        tags: ['Finance'],
        summary: 'Listar categorías financieras',
        responses: { '200': { description: 'Lista de categorías' } },
      },
      post: {
        tags: ['Finance'],
        summary: 'Crear categoría',
        responses: { '201': { description: 'Categoría creada' } },
      },
    },
    '/admin/sync/initiate': {
      post: {
        tags: ['Sync'],
        summary: 'Iniciar sincronización',
        description: 'Inicia un proceso de sincronización de datos offline',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['deviceId'],
                properties: {
                  deviceId: { type: 'string' },
                  lastSyncDate: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Sincronización iniciada' } },
      },
    },
    '/admin/sync/apply': {
      post: {
        tags: ['Sync'],
        summary: 'Aplicar cambios de sincronización',
        description: 'Aplica los cambios recibidos durante la sincronización',
        responses: { '200': { description: 'Cambios aplicados' } },
      },
    },
    '/admin/sync/status': {
      get: {
        tags: ['Sync'],
        summary: 'Estado de sincronización',
        description: 'Obtiene el estado actual de la sincronización',
        responses: { '200': { description: 'Estado de sincronización' } },
      },
    },
    '/admin/sync/history': {
      get: {
        tags: ['Sync'],
        summary: 'Historial de sincronización',
        description: 'Obtiene el historial de sincronizaciones realizadas',
        responses: { '200': { description: 'Historial de sincronización' } },
      },
    },
    '/admin/sync/conflicts': {
      get: {
        tags: ['Sync'],
        summary: 'Listar conflictos sin resolver',
        description: 'Obtiene la lista de conflictos de sincronización pendientes',
        responses: { '200': { description: 'Lista de conflictos' } },
      },
    },
    '/admin/sync/conflicts/{id}/resolve': {
      post: {
        tags: ['Sync'],
        summary: 'Resolver conflicto',
        description: 'Resuelve un conflicto de sincronización',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Conflicto resuelto' } },
      },
    },
  },
};
