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
    '/reproduction/services': {
      get: {
        tags: ['Reproduction'],
        summary: 'Listar servicios reproductivos',
        responses: { '200': { description: 'Lista de servicios' } },
      },
      post: {
        tags: ['Reproduction'],
        summary: 'Registrar servicio',
        responses: { '201': { description: 'Servicio registrado' } },
      },
    },
    '/senasag/gmas': {
      get: {
        tags: ['SENASAG'],
        summary: 'Listar GMAs',
        responses: { '200': { description: 'Lista de GMAs' } },
      },
      post: {
        tags: ['SENASAG'],
        summary: 'Crear GMA',
        responses: { '201': { description: 'GMA creado' } },
      },
    },
    '/finance/movements': {
      get: {
        tags: ['Finance'],
        summary: 'Listar movimientos financieros',
        responses: { '200': { description: 'Lista de movimientos' } },
      },
      post: {
        tags: ['Finance'],
        summary: 'Registrar movimiento',
        responses: { '201': { description: 'Movimiento registrado' } },
      },
    },
    '/admin/sync': {
      post: {
        tags: ['Sync'],
        summary: 'Sincronizar datos',
        responses: { '200': { description: 'Sincronización exitosa' } },
      },
    },
  },
};
