# Event Publishing Handbook / 活动发布手册

This handbook documents the repeatable workflow for publishing a SAIMA event, preparing ticket sales, generating promotional QR codes, issuing complimentary tickets, and running check-in.

本手册记录 SAIMA 活动发布、票务配置、宣传二维码生成、赠票和现场检票的完整可复用流程。

## 1. Event Identity / 活动标识

Use one stable `eventPublicId` for each event. The current convention is a date-like ID such as `20261016`.

每个活动使用一个稳定的 `eventPublicId`。目前约定使用类似日期的编号，例如 `20261016`。

- Public event page / 公开活动页: `/events/20261016`
- Ticket sales config key / 票务配置键: `eventPublicId: "20261016"`
- QR file name / 二维码文件名: `saima-event-20261016.svg`

For example:
```
bunx qrcode -o saima-event-20261016.svg https://www.saima.com.au/events/20261016
bunx qrcode -o saima-event-20261024.svg https://www.saima.com.au/events/20261024
```

## 2. Pre-Publishing Checklist / 发布前检查

Before opening ticket sales, confirm these items.

开放售票前，先确认以下内容。

- Event content is written and reviewed in `docs/content/events/<eventPublicId>/`.
- 活动文案已写入并审核：`docs/content/events/<eventPublicId>/`。
- Public page content is wired into the website event content source.
- 官网活动页内容已经接入网站活动内容源。
- Event media files are uploaded to Cloudflare R2.
- 活动图片、海报、PDF 等媒体文件已上传到 Cloudflare R2。
- The event exists in Supabase `events` records with the same `public_id`.
- Supabase 的 `events` 记录中已有同一个 `public_id`。
- Ticket sales are configured in `apps/web/src/config/ticket-sales.json`.
- 售票配置已写入 `apps/web/src/config/ticket-sales.json`。
- The event page is tested locally at `http://localhost:3000/events/<eventPublicId>`.
- 本地已测试活动页：`http://localhost:3000/events/<eventPublicId>`。

## 3. Ticket Sales Configuration / 票务配置

Ticket sales are configured in `apps/web/src/config/ticket-sales.json`.

售票配置位于 `apps/web/src/config/ticket-sales.json`。

For each event, add one top-level object:

每个活动新增一个顶层对象：

```json
{
  "eventPublicId": "20261016",
  "currency": "AUD",
  "capacity": 500,
  "saleStartsAt": "2026-08-01T00:00:00+09:30",
  "saleEndsAt": "2026-10-16T19:30:00+10:30",
  "isActive": true,
  "ticketTypes": []
}
```

Field guide:

字段说明：

- `eventPublicId`: must match the public event page ID and Supabase `events.public_id`.
- `eventPublicId`：必须和公开活动页 ID、Supabase `events.public_id` 一致。
- `currency`: normally `AUD`.
- `currency`：通常使用 `AUD`。
- `capacity`: total capacity units for the event.
- `capacity`：活动总容量单位。
- `saleStartsAt`: when this event can start selling tickets.
- `saleStartsAt`：开始售票时间。
- `saleEndsAt`: when sales close. Usually set near event start time.
- `saleEndsAt`：停止售票时间，通常设在活动开始附近。
- `isActive`: controls whether the event page shows the ticket sale module.
- `isActive`：控制活动页是否显示售票模块。
- `ticketTypes`: the available ticket types.
- `ticketTypes`：可售票种。

Each ticket type should include:

每个票种需要包含：

```json
{
  "slug": "general",
  "name": "General admission",
  "description": "Standard reserved ticket.",
  "priceCents": 3500,
  "capacityUnitsPerTicket": 1,
  "sortOrder": 10
}
```

Ticket type rules:

票种规则：

- `slug` must be unique within the event.
- `slug` 在同一个活动内必须唯一。
- `priceCents` is the price in cents. `3500` means AUD 35.00.
- `priceCents` 用分为单位，`3500` 表示 AUD 35.00。
- `capacityUnitsPerTicket` controls capacity usage. A family ticket for 4 seats should use `4`.
- `capacityUnitsPerTicket` 控制占用容量。四人家庭票应使用 `4`。
- Use `sortOrder` to control display order.
- 使用 `sortOrder` 控制页面显示顺序。
- For temporary offers, add a ticket-level `saleEndsAt`.
- 临时优惠票可以在票种里单独加 `saleEndsAt`。

After editing the config, run the relevant checks before deployment:

修改配置后，部署前运行相关检查：

```bash
bun run test
bun run typecheck
bun run build
```

## 4. Local Admin URLs / 本地管理入口

Use these local admin pages during setup and testing:

配置和测试时使用以下本地管理页面：

- Users and roles / 用户和角色: `http://localhost:3000/dashboard/admin/users`
- Free tickets / 赠票: `http://localhost:3000/dashboard/admin/free-tickets`
- Ticket sales overview / 售票概览: `http://localhost:3000/dashboard/admin/ticket-sales`
- Ticket check-in / 检票: `http://localhost:3000/dashboard/admin/ticket-checkin`

On production, replace `http://localhost:3000` with `https://www.saima.com.au`.

在线上环境，将 `http://localhost:3000` 替换为 `https://www.saima.com.au`。

## 5. Assign Admin Access for Check-In Staff / 给检票人员分配管理员权限

Check-in requires the staff member to be signed in and have the `admin` role.

检票人员必须先登录，并且账号角色必须是 `admin`。

Steps:

步骤：

English:

1. Ask each check-in staff member to sign in once so their user profile exists.
2. Open `http://localhost:3000/dashboard/admin/users`.
3. Find the staff member by name or email.
4. Click `admin` for that user.
5. Ask the staff member to refresh or sign in again before check-in starts.

中文：

1. 请每位检票人员先登录一次，确保系统里已有他们的用户资料。
2. 打开 `http://localhost:3000/dashboard/admin/users`。
3. 按姓名或邮箱找到该人员。
4. 点击该用户的 `admin` 角色按钮。
5. 请检票人员刷新页面或重新登录后再开始检票。

Security note: remove temporary admin access after the event if the person does not need ongoing admin access.

安全提醒：活动结束后，如果该人员不需要长期管理权限，应移除临时 `admin` 权限。

## 6. Selling Tickets from the Event Page / 通过活动页售票

Public ticket sales happen from the event page, for example:

公开售票在活动页进行，例如：

`https://www.saima.com.au/events/20261016`

Buyer flow:

购票流程：

English:

1. Visitor opens the event page.
2. Visitor chooses a ticket type and quantity.
3. Visitor enters name, email, and phone.
4. Visitor continues to Stripe Checkout.
5. After successful payment, the ticket is confirmed and a confirmation email is sent.
6. The email contains the check-in QR code.

中文：

1. 观众打开活动页。
2. 观众选择票种和数量。
3. 观众填写姓名、邮箱和电话。
4. 观众进入 Stripe Checkout 完成付款。
5. 付款成功后，订单确认，并发送购票确认邮件。
6. 邮件中包含入场检票二维码。

Admin monitoring:

管理员监控：

- Use `http://localhost:3000/dashboard/admin/ticket-sales` to review sold, pending payment, remaining capacity, and revenue.
- 使用 `http://localhost:3000/dashboard/admin/ticket-sales` 查看已售、待付款、剩余容量和收入。
- Refresh the page during sales or before the event to get the latest numbers.
- 售票期间或活动前刷新页面查看最新数据。

## 7. Issuing Complimentary Tickets / 赠票

Complimentary tickets are issued from:

赠票入口：

`http://localhost:3000/dashboard/admin/free-tickets`

Steps:

步骤：

English:

1. Confirm the recipient has signed in once and has a profile.
2. Open the Free Tickets page.
3. Choose the recipient.
4. Choose the event.
5. Choose the ticket type.
6. Enter the quantity.
7. Click `Create free ticket`.
8. Confirm the page reports that the ticket was created and the email was sent.

中文：

1. 确认收票人已经登录过一次，并且系统里已有用户资料。
2. 打开赠票页面。
3. 选择收票人。
4. 选择活动。
5. 选择票种。
6. 输入数量。
7. 点击 `Create free ticket`。
8. 确认页面提示赠票已创建，并且确认邮件已发送。

Current limitation:

当前限制：

- The current free-ticket recipient list is limited to existing `ADMIN_EMAILS` profiles.
- 当前赠票收件人列表限制为已有的 `ADMIN_EMAILS` 用户资料。
- If a recipient does not appear, confirm they have signed in and confirm whether their email is eligible under the current configuration.
- 如果收件人没有出现在列表中，先确认他们是否登录过，再确认邮箱是否符合当前配置。

## 8. Check-In Workflow / 现场检票流程

Ticket QR codes point to the admin check-in page with a secure token:

票务二维码会打开带安全 token 的管理员检票页面：

`/dashboard/admin/ticket-checkin?token=...`

Before doors open:

开门前：

- Confirm every check-in staff member can sign in.
- 确认每位检票人员都能登录。
- Confirm each staff member has the `admin` role.
- 确认每位检票人员都有 `admin` 角色。
- Test one known ticket QR code.
- 用一张已知有效票测试扫码。
- Keep a backup device signed in as admin.
- 准备一台备用设备，并提前登录管理员账号。

At the entrance:

入口操作：

English:

1. Staff scans the ticket QR code from the buyer's email.
2. The check-in page opens automatically.
3. The page shows one of three statuses.

中文：

1. 工作人员扫描观众邮件里的票务二维码。
2. 检票页面会自动打开。
3. 页面会显示三种状态之一。

Status guide:

状态说明：

- `Ticket checked in.` means the ticket is valid and has now been checked in.
- `Ticket checked in.` 表示票有效，并且刚刚完成入场登记。
- `Ticket was already checked in...` means the QR code was used before. Ask for ID or review the ticket details before allowing entry.
- `Ticket was already checked in...` 表示二维码之前已经使用过。放行前应核对身份或查看票务详情。
- `Ticket QR code is invalid.` or missing token means the QR code or link is not valid.
- `Ticket QR code is invalid.` 或缺少 token 表示二维码或链接无效。

The check-in page also shows ticket holder, event, ticket type, quantity, event time, location, payment time, and check-in time when available.

检票页面会显示购票人、活动、票种、数量、活动时间、地点、付款时间，以及可用时的检票时间。


## 9. Future Event Template / 未来活动模板

For a new event, replace `<eventPublicId>` with the new event ID.

创建新活动时，将 `<eventPublicId>` 替换为新的活动 ID。

```bash
bunx qrcode -o docs/qrcode/saima-event-<eventPublicId>.svg https://www.saima.com.au/events/<eventPublicId>
```

Minimum repeated setup:

每次最少重复配置：

- Add or update content in `docs/content/events/<eventPublicId>/`.
- 新增或更新 `docs/content/events/<eventPublicId>/` 内容。
- Add the event to the website event content source.
- 将活动加入网站活动内容源。
- Add the event record to Supabase seed or migration data if needed.
- 如有需要，将活动记录加入 Supabase seed 或 migration 数据。
- Add the ticket sale config to `apps/web/src/config/ticket-sales.json`.
- 将售票配置加入 `apps/web/src/config/ticket-sales.json`。
- Generate the promotional QR code into `docs/qrcode/`.
- 在 `docs/qrcode/` 生成宣传二维码。
- Assign temporary admin access to check-in staff.
- 给检票人员分配临时管理员权限。
- Test event page sales, complimentary tickets, and check-in before launch.
- 上线前测试活动页售票、赠票和检票。
