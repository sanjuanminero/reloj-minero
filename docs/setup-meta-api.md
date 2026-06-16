# Setup Instagram Graph API — Reloj Minero

Objetivo: habilitar la **publicación automática** (posts y stories) en Instagram vía la
Graph API de Meta. Se hace **una sola vez**. Al final tenés 3 datos que me pasás y queda
todo conectado.

> Requisito de partida: la cuenta de Instagram debe ser **Business** o **Creator**
> (ya lo es) y vos sos admin de la cuenta y de una Página de Facebook.

---

## Paso 1 — Vincular Instagram a una Página de Facebook

La API publica a través de una Página de Facebook vinculada a la cuenta de IG.

1. Si no tenés una Página de Facebook para Reloj Minero, creá una:
   facebook.com → menú → **Páginas** → **Crear nueva página**.
2. En **Instagram** (app o web): Configuración → **Cuentas vinculadas** /
   **Compartir en otras apps** → vincular la **Página de Facebook** de Reloj Minero.
   - Alternativa: desde la Página de FB → Configuración → **Cuentas vinculadas** →
     Instagram → conectar.

✅ Resultado: IG Business ↔ Página de Facebook vinculadas.

---

## Paso 2 — Crear la app en Meta for Developers

1. Entrá a **https://developers.facebook.com/** con tu cuenta de Facebook.
2. Aceptá los términos de desarrollador si te lo pide.
3. **My Apps** → **Create App**.
4. Caso de uso: elegí **"Other"** → tipo **"Business"**.
5. Nombre de la app: `Reloj Minero Publisher` (interno, no lo ve el público).
6. Create app.

---

## Paso 3 — Agregar el producto de Instagram

1. Dentro de la app → **Add products** / **Productos**.
2. Buscá **Instagram** → **Set up**.
   (Para publicar en tu propia cuenta Business conectada a una Página, el flujo correcto
   es el de **Facebook Login** con permisos de Instagram, no el de "Instagram Login".)
3. Si te ofrece **Facebook Login for Business**, agregalo también (lo usamos para el token).

---

## Paso 4 — Generar el token de usuario con los permisos correctos

1. Andá a **Tools → Graph API Explorer**
   (https://developers.facebook.com/tools/explorer/).
2. Arriba a la derecha: seleccioná tu app **Reloj Minero Publisher**.
3. **Generate Access Token** / **Add permissions** y marcá estos scopes:
   - `instagram_basic`
   - `instagram_content_publish`   ← el clave para publicar
   - `pages_show_list`
   - `pages_read_engagement`
   - `business_management`
4. Generá el token y **aceptá los permisos** en el popup (elegí la Página de Reloj Minero
   y la cuenta de IG cuando lo pregunte).
5. Copiá ese **token corto** (dura ~1–2 h; lo convertimos en el paso 6).

> Nota: mientras la app esté en modo **Development**, podés publicar en TU propia cuenta
> sin pasar la revisión de Meta, siempre que seas **admin/tester** de la app. No hace falta
> "App Review" para una sola cuenta propia.

---

## Paso 5 — Obtener el IG Business Account ID

En el mismo Graph API Explorer, ejecutá estas dos consultas (botón **Submit**):

1. `me/accounts`
   → te devuelve tus Páginas. Copiá el **`id`** de la Página de Reloj Minero.

2. `{PAGE_ID}?fields=instagram_business_account`
   (reemplazá `{PAGE_ID}` por el id anterior)
   → te devuelve algo como:
   ```json
   { "instagram_business_account": { "id": "17841400000000000" } }
   ```
   Ese `id` es tu **IG_USER_ID**. Guardalo.

---

## Paso 6 — Convertir el token en uno de larga duración (60 días)

Pegá esta URL en el navegador, reemplazando los valores
(App ID y App Secret están en la app → **Settings → Basic**):

```
https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_CORTO
```

Te devuelve un **`access_token`** de larga duración. Ese es el que usamos.
(El script que voy a escribir lo **renueva automáticamente** antes de que venza, así no
se cae nunca.)

---

## Paso 7 — Pasame estos 3 datos (en privado)

Cuando tengas todo, mandame:

| Dato | De dónde sale |
|------|---------------|
| `IG_USER_ID` | Paso 5 |
| `ACCESS_TOKEN` (largo) | Paso 6 |
| `APP_ID` + `APP_SECRET` | App → Settings → Basic |

Con eso configuro el publicador y hacemos una **prueba real** con un post de test.

---

## Límites buenos de saber

- **25 publicaciones / 24 h** por cuenta (de sobra para 3 posts + stories/semana).
- La API publica imágenes desde una **URL pública** (resuelto con Google Drive).
- **Stories**: soportadas para cuentas Business vía la API (`media_type=STORIES`).
- El token largo dura **60 días** → el script lo renueva solo.
