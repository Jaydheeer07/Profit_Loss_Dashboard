# Profit & Loss Dashboard API Documentation

This document provides comprehensive documentation for the Profit & Loss Dashboard API endpoints, including request/response formats and example usage.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Authentication is implemented using Supabase Auth. API endpoints are protected using JWT tokens.

### Authentication Architecture

The authentication system uses a modular, dependency-injection based architecture:

- **Interface-based design**: All authentication operations are defined in an abstract interface
- **Production implementation**: Uses Supabase Auth services for production environments
- **Testing implementation**: Uses a mock service for testing without external dependencies
- **Dependency injection**: Auth services are provided through dependency injection for better testability

### Authentication Endpoints

#### User Registration
**POST** `/api/auth/signup`

Registers a new user with email verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "69763570-724f-4ec9-a03d-bfdda1a304a5",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "email_verified": false
    },
    // Additional user details
  },
  "session": null  // Session is null until email verification
}
```

#### User Login
**POST** `/api/auth/signin`

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "69763570-724f-4ec9-a03d-bfdda1a304a5",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe",
      "email_verified": true
    },
    // Additional user details
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR...",
    "refresh_token": "tw7jkclofaj4",
    "expires_in": 3600,
    "expires_at": 1746749489,
    "token_type": "bearer"
  }
}
```

#### Get Current User
**GET** `/api/auth/me`

Retrieve the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR...
```

**Success Response (200):**
```json
{
  "user": {
    "id": "69763570-724f-4ec9-a03d-bfdda1a304a5",
    "email": "user@example.com",
    // User profile details
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR..."
  }
}
```

#### Sign Out
**POST** `/api/auth/signout`

Log out the current authenticated user and invalidate their session.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR...
```

**Success Response (200):**
```json
{
  "message": "Successfully signed out"
}
```

#### Create Organization
**POST** `/api/auth/organizations/create`

Create a new organization and add the current user as owner.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR...
```

**Request Body:**
```json
{
  "name": "Augment Pty Ltd"
}
```

**Success Response (200):**
```json
{
  "organization": {
    "id": "37cd92f6-4d0d-470c-a133-1fbf4850faa9",
    "name": "Augment Pty Ltd",
    "created_at": "2025-05-09T01:57:10.380024+00:00",
    "updated_at": "2025-05-09T01:57:10.380024+00:00"
  },
  "membership": {
    "id": "daf51885-046d-48c7-a9bb-a13f499c05a8",
    "role": "owner",
    "user_id": "69763570-724f-4ec9-a03d-bfdda1a304a5",
    "created_at": "2025-05-09T01:57:10.380024+00:00",
    "updated_at": "2025-05-09T01:57:10.380024+00:00",
    "organization_id": "37cd92f6-4d0d-470c-a133-1fbf4850faa9"
  }
}
```

#### List Organizations
**GET** `/api/auth/organizations/list`

Retrieve all organizations that the current user is a member of.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IkIrVUZUZjZKR...
```

**Success Response (200):**
```json
{
  "organizations": [
    {
      "id": "37cd92f6-4d0d-470c-a133-1fbf4850faa9",
      "name": "Augment Pty Ltd",
      "created_at": "2025-05-09T01:57:10.380024+00:00",
      "updated_at": "2025-05-09T01:57:10.380024+00:00"
    }
  ]
}
```

### Multi-tenant Security Implementation

ProfitLens implements a secure multi-tenant architecture using Supabase's Row Level Security (RLS) features:

#### Row Level Security (RLS) Policies

The system implements RLS policies to ensure data isolation between organizations:

- Users can only access data for organizations they belong to
- Organization owners have elevated privileges for their organizations
- A special `SECURITY DEFINER` function handles the bootstrapping problem when creating new organizations

#### Organization Membership Bootstrapping

To solve the "chicken and egg" problem of adding the first user to an organization, we implemented a PostgreSQL function with `SECURITY DEFINER` privileges:

```sql
CREATE OR REPLACE FUNCTION public.create_organization_with_owner(
  org_name TEXT,
  owner_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
  -- Function creates both organization and member in one transaction
$$;
```

This privileged function bypasses RLS checks specifically for the bootstrap process, maintaining security while solving the initialization problem.

### Authentication Validation Requirements

#### Password Requirements
- **Minimum length**: 6 characters (Supabase default)
- **Recommended length**: 8+ characters for better security
- **Character types**: Depending on Supabase project settings, may require:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- **Note**: Some special characters (like "+") may cause issues with authentication

#### Email Requirements
- Must be a valid email format
- Must be unique (not already registered)
- While test domains like `example.com` may work in the test environment, Supabase might reject obviously fake domains in production

#### Username/Full Name Requirements
- Minimum 1 character

## Interactive Documentation

Swagger UI documentation is available at `/docs` when the server is running. This provides an interactive interface to test all API endpoints.

## Database Schema and Relationships

ProfitLens uses a multi-tenant database architecture with Supabase and Row Level Security (RLS) to ensure data isolation between organizations. Below is the database schema and relationships between tables.

### Database Tables

#### 1. Users Table (auth.users)
- Managed automatically by Supabase Auth
- Contains user authentication data (email, password hash, etc.)
- Primary key: `id` (UUID)

```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT NOT NULL,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_metadata JSONB
);
```

#### 2. Organizations Table
- Stores information about organizations
- Primary key: `id` (UUID)
- Fields:
  - `name`: Organization name
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Organization Members Table
- Junction table for the many-to-many relationship between users and organizations
- Primary key: `id` (UUID)
- Foreign keys:
  - `organization_id` → `organizations.id`
  - `user_id` → `auth.users.id`
- Fields:
  - `role`: User's role in the organization ('owner', 'admin', 'member')
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);
```

#### 4. Reports Table
- Stores metadata about uploaded financial reports
- Primary key: `id` (UUID)
- Foreign keys:
  - `organization_id` → `organizations.id`
  - `uploaded_by` → `auth.users.id`
- Fields:
  - `name`: Report name
  - `description`: Report description
  - `period`: Financial period
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  period TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. Report Data Table
- Stores the actual financial data from reports
- Primary key: `id` (UUID)
- Foreign key:
  - `report_id` → `reports.id`
- Fields:
  - `data`: JSONB field containing processed financial data
  - `created_at`: Timestamp

```sql
CREATE TABLE report_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. Time Series Data Table
- Stores time series data for historical analysis
- Primary key: `id` (UUID)
- Foreign key:
  - `organization_id` → `organizations.id`
- Fields:
  - `period`: Financial period
  - `metric_name`: Name of the metric
  - `metric_value`: Numeric value of the metric
  - `created_at`: Timestamp

```sql
CREATE TABLE time_series_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Relationships

1. **Users to Organizations** (Many-to-Many):
   - A user can belong to multiple organizations
   - An organization can have multiple users
   - The `organization_members` table manages this relationship with roles

2. **Organizations to Reports** (One-to-Many):
   - An organization can have multiple reports
   - A report belongs to exactly one organization

3. **Reports to Report Data** (One-to-One):
   - A report has exactly one report data entry
   - A report data entry belongs to exactly one report

4. **Organizations to Time Series Data** (One-to-Many):
   - An organization can have multiple time series data points
   - A time series data point belongs to exactly one organization

### Row Level Security (RLS) Policies

Row Level Security is implemented to ensure that users can only access data from organizations they are members of.

#### Organizations Table RLS

```sql
-- Enable RLS on organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Allow users to select organizations they are members of
CREATE POLICY "Users can view organizations they are members of" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Allow users to insert organizations (they will become members via a trigger)
CREATE POLICY "Users can insert organizations" ON organizations
  FOR INSERT WITH CHECK (true);
```

#### Organization Members Table RLS

```sql
-- Enable RLS on organization_members table
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Allow users to view memberships for organizations they are members of
CREATE POLICY "Users can view memberships for their organizations" ON organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Allow users to insert their own membership
CREATE POLICY "Users can insert their own membership" ON organization_members
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

#### Reports Table RLS

```sql
-- Enable RLS on reports table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow users to view reports for organizations they are members of
CREATE POLICY "Users can view reports for their organizations" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = reports.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Allow users to insert reports for organizations they are members of
CREATE POLICY "Users can insert reports for their organizations" ON reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = reports.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );
```

#### Report Data Table RLS

```sql
-- Enable RLS on report_data table
ALTER TABLE report_data ENABLE ROW LEVEL SECURITY;

-- Allow users to view report data for organizations they are members of
CREATE POLICY "Users can view report data for their organizations" ON report_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports
      JOIN organization_members ON reports.organization_id = organization_members.organization_id
      WHERE reports.id = report_data.report_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Allow users to insert report data for organizations they are members of
CREATE POLICY "Users can insert report data for their organizations" ON report_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports
      JOIN organization_members ON reports.organization_id = organization_members.organization_id
      WHERE reports.id = report_data.report_id
      AND organization_members.user_id = auth.uid()
    )
  );
```

#### Time Series Data Table RLS

```sql
-- Enable RLS on time_series_data table
ALTER TABLE time_series_data ENABLE ROW LEVEL SECURITY;

-- Allow users to view time series data for organizations they are members of
CREATE POLICY "Users can view time series data for their organizations" ON time_series_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = time_series_data.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Allow users to insert time series data for organizations they are members of
CREATE POLICY "Users can insert time series data for their organizations" ON time_series_data
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = time_series_data.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );
```
  - `metric_name`: Name of the metric
  - `metric_value`: Numeric value of the metric
  - `created_at`: Timestamp

### Entity Relationship Diagram (Simplified)

```
auth.users 1──────┐
                  │
                  │ N
                  ▼
organizations 1───┬───N organization_members N───1 auth.users
       │          │
       │          │
       │          │
       │1         │
       │          │
       ▼          │
    reports N─────┘
       │1
       │
       ▼
  report_data 1
       
       ▲
       │N
       │
organizations 1───N time_series_data
```

### Row Level Security (RLS)

All tables have Row Level Security policies that ensure users can only access data belonging to their organizations:

- Users can only view/modify organizations they are members of
- Users can only view/modify reports belonging to their organizations
- Users can only view/modify report data for reports belonging to their organizations
- Users can only view/modify time series data for their organizations

### Practical Example

Let's walk through a complete example of how the database is used in a typical user flow:

1. **User Registration**:
   - John registers with email john@example.com
   - Supabase creates a user record with ID `user_123`

2. **Organization Creation**:
   - John creates "Acme Inc." organization
   - System creates organization with ID `org_456`
   - System adds John as owner with role "owner" in organization_members

3. **File Upload**:
   - John uploads "Q1 Financial Report.xlsx"
   - System processes the file and extracts financial data
   - System creates a report record with ID `report_789` linked to `org_456`
   - System stores the processed data in report_data linked to `report_789`
   - System extracts key metrics (gross profit margin: 42%, net profit: $100,000) and stores them in time_series_data

4. **Dashboard View**:
   - John views the dashboard
   - System fetches reports for `org_456`
   - System fetches report data for `report_789`
   - System fetches time series data for `org_456` to show historical trends
   - Dashboard displays the financial metrics, visualizations, and AI-generated insights

5. **Team Collaboration**:
   - John invites Sarah (sarah@example.com) to join Acme Inc.
   - System adds Sarah as member with role "member" in organization_members
   - Sarah can now view all reports and data for Acme Inc., but not for any other organization

## API Endpoints

### Authentication

#### `POST /api/auth/signup`

Register a new user.

**Request:**
- Content-Type: `application/json`
- Body:
  - `email`: User's email address
  - `password`: User's password (min length: 6 characters)
  - `full_name`: User's full name

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: User data and session information

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","full_name":"John Doe"}'
```

**Example Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ey...",
    "expires_in": 3600
  }
}
```

#### `POST /api/auth/signin`

Sign in a user.

**Request:**
- Content-Type: `application/json`
- Body:
  - `email`: User's email address
  - `password`: User's password

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: User data and session information

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Example Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ey...",
    "expires_in": 3600
  }
}
```

#### `POST /api/auth/signout`

Sign out a user.

**Request:**
- Authorization: Bearer token

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Success message

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/signout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
{
  "message": "Successfully signed out"
}
```

#### `GET /api/auth/me`

Get the current authenticated user.

**Request:**
- Authorization: Bearer token

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: User data

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  }
}
```

#### `POST /api/auth/organizations`

Create a new organization.

**Request:**
- Authorization: Bearer token
- Content-Type: `application/json`
- Body:
  - `name`: Organization name

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Organization and membership data

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/auth/organizations" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Inc."}'
```

**Example Response:**
```json
{
  "organization": {
    "id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Inc.",
    "created_at": "2025-05-08T04:30:00.000Z",
    "updated_at": "2025-05-08T04:30:00.000Z"
  },
  "membership": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "role": "owner",
    "created_at": "2025-05-08T04:30:00.000Z",
    "updated_at": "2025-05-08T04:30:00.000Z"
  }
}
```

#### `GET /api/auth/organizations`

Get all organizations for the current user.

**Request:**
- Authorization: Bearer token

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: List of organizations

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/auth/organizations" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
{
  "organizations": [
    {
      "id": "456e4567-e89b-12d3-a456-426614174000",
      "name": "Acme Inc.",
      "created_at": "2025-05-08T04:30:00.000Z",
      "updated_at": "2025-05-08T04:30:00.000Z"
    },
    {
      "id": "567e4567-e89b-12d3-a456-426614174000",
      "name": "XYZ Corp",
      "created_at": "2025-05-08T05:15:00.000Z",
      "updated_at": "2025-05-08T05:15:00.000Z"
    }
  ]
}
```

### Reports

#### `POST /api/reports`

Create a new financial report and process the uploaded file.

**Request:**
- Authorization: Bearer token
- Content-Type: `multipart/form-data`
- Body:
  - `organization_id`: Organization ID (UUID)
  - `name`: Report name
  - `description`: Report description (optional)
  - `period`: Financial period
  - `file`: Excel file (.xlsx or .xls)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Report and data information

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/reports" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "organization_id=456e4567-e89b-12d3-a456-426614174000" \
  -F "name=Q1 2025 Financial Report" \
  -F "description=Quarterly financial report" \
  -F "period=Q1 2025" \
  -F "file=@financial_report.xlsx"
```

**Example Response:**
```json
{
  "report": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Q1 2025 Financial Report",
    "description": "Quarterly financial report",
    "period": "Q1 2025",
    "uploaded_by": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2025-05-08T06:00:00.000Z",
    "updated_at": "2025-05-08T06:00:00.000Z"
  },
  "data": {
    "id": "890e4567-e89b-12d3-a456-426614174000",
    "report_id": "789e4567-e89b-12d3-a456-426614174000",
    "data": {
      "financialData": { /* Financial data object */ },
      "metricsData": { /* Metrics data object */ },
      "insightsData": { /* Insights data object */ }
    },
    "created_at": "2025-05-08T06:00:00.000Z"
  }
}
```

#### `GET /api/reports`

Get all reports for an organization.

**Request:**
- Authorization: Bearer token
- Query Parameters:
  - `organization_id`: Organization ID (UUID)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: List of reports

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/reports?organization_id=456e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
[
  {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Q1 2025 Financial Report",
    "description": "Quarterly financial report",
    "period": "Q1 2025",
    "uploaded_by": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2025-05-08T06:00:00.000Z",
    "updated_at": "2025-05-08T06:00:00.000Z"
  },
  {
    "id": "901e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Q2 2025 Financial Report",
    "description": "Quarterly financial report",
    "period": "Q2 2025",
    "uploaded_by": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2025-05-08T07:30:00.000Z",
    "updated_at": "2025-05-08T07:30:00.000Z"
  }
]
```

#### `GET /api/reports/{report_id}`

Get a report by ID.

**Request:**
- Authorization: Bearer token
- Path Parameters:
  - `report_id`: Report ID (UUID)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Report and data information

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/reports/789e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
{
  "report": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "name": "Q1 2025 Financial Report",
    "description": "Quarterly financial report",
    "period": "Q1 2025",
    "uploaded_by": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2025-05-08T06:00:00.000Z",
    "updated_at": "2025-05-08T06:00:00.000Z"
  },
  "data": {
    "id": "890e4567-e89b-12d3-a456-426614174000",
    "report_id": "789e4567-e89b-12d3-a456-426614174000",
    "data": {
      "financialData": { /* Financial data object */ },
      "metricsData": { /* Metrics data object */ },
      "insightsData": { /* Insights data object */ }
    },
    "created_at": "2025-05-08T06:00:00.000Z"
  }
}
```

#### `GET /api/reports/time-series/{organization_id}`

Get time series data for an organization.

**Request:**
- Authorization: Bearer token
- Path Parameters:
  - `organization_id`: Organization ID (UUID)
- Query Parameters:
  - `metric_name`: Optional metric name filter

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: List of time series data points

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/reports/time-series/456e4567-e89b-12d3-a456-426614174000?metric_name=gross_profit_margin" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example Response:**
```json
[
  {
    "id": "a01e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "period": "Q1 2025",
    "metric_name": "gross_profit_margin",
    "metric_value": 0.42,
    "created_at": "2025-05-08T06:00:00.000Z"
  },
  {
    "id": "b02e4567-e89b-12d3-a456-426614174000",
    "organization_id": "456e4567-e89b-12d3-a456-426614174000",
    "period": "Q2 2025",
    "metric_name": "gross_profit_margin",
    "metric_value": 0.45,
    "created_at": "2025-05-08T07:30:00.000Z"
  }
]
```

### File Upload

#### `POST /api/upload`

Upload and process a profit and loss Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `file`: Excel file (.xlsx or .xls)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Financial data object (see schema below)

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/upload/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample_pl_report.xlsx"
```

**Example Response:**
```json
{
  "companyName": "Test Company Ltd",
  "period": "For the month ended May 31, 2025",
  "basisType": "Accrual",
  "reportType": "Complete",
  "sections": {
    "tradingIncome": {
      "accounts": [
        {
          "name": "Sales",
          "value": 95000.0,
          "category": "Revenue"
        },
        {
          "name": "Service Revenue",
          "value": 10000.0,
          "category": "Revenue"
        },
        {
          "name": "Other Income",
          "value": 5000.0,
          "category": "Revenue"
        }
      ],
      "total": 110000.0
    },
    "costOfSales": {
      "accounts": [
        {
          "name": "Purchases",
          "value": 40000.0,
          "category": "COGS"
        },
        {
          "name": "Direct Labor",
          "value": 15000.0,
          "category": "COGS"
        },
        {
          "name": "Manufacturing Supplies",
          "value": 5000.0,
          "category": "COGS"
        }
      ],
      "total": 60000.0
    },
    "grossProfit": 50000.0,
    "operatingExpenses": {
      "accounts": [
        {
          "name": "Rent",
          "value": 5000.0,
          "category": "Facilities"
        },
        {
          "name": "Utilities",
          "value": 2000.0,
          "category": "Utilities"
        },
        {
          "name": "Salaries and Wages",
          "value": 20000.0,
          "category": "Personnel"
        },
        {
          "name": "Insurance",
          "value": 1500.0,
          "category": "Insurance"
        },
        {
          "name": "Marketing",
          "value": 3000.0,
          "category": "Marketing"
        },
        {
          "name": "Office Supplies",
          "value": 1000.0,
          "category": "Office"
        },
        {
          "name": "Professional Fees",
          "value": 2500.0,
          "category": "Professional Services"
        }
      ],
      "total": 35000.0
    },
    "netProfit": 15000.0
  },
  "metadata": {
    "uploadDate": "2025-05-05T11:38:12",
    "source": "Excel Upload",
    "currency": "USD"
  }
}
```

**Error Responses:**
- 400 Bad Request: If the uploaded file is not an Excel file
- 422 Unprocessable Entity: If no file is provided
- 500 Internal Server Error: If there's an error processing the file

### Financial Metrics

#### `POST /api/metrics`

Calculate financial metrics from profit and loss data and prepare data for insights.

**Request:**
- Content-Type: `application/json`
- Body: Financial data object (same format as the upload response)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Object containing company name, period, and financial data with metrics

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/metrics" \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Company Ltd","period":"For the month ended May 31, 2025","basisType":"Accrual","reportType":"Complete","sections":{"tradingIncome":{"accounts":[{"name":"Sales","value":95000.0,"category":"Revenue"},{"name":"Service Revenue","value":10000.0,"category":"Revenue"},{"name":"Other Income","value":5000.0,"category":"Revenue"}],"total":110000.0},"costOfSales":{"accounts":[{"name":"Purchases","value":40000.0,"category":"COGS"},{"name":"Direct Labor","value":15000.0,"category":"COGS"},{"name":"Manufacturing Supplies","value":5000.0,"category":"COGS"}],"total":60000.0},"grossProfit":50000.0,"operatingExpenses":{"accounts":[{"name":"Rent","value":5000.0,"category":"Facilities"},{"name":"Utilities","value":2000.0,"category":"Utilities"},{"name":"Salaries and Wages","value":20000.0,"category":"Personnel"},{"name":"Insurance","value":1500.0,"category":"Insurance"},{"name":"Marketing","value":3000.0,"category":"Marketing"},{"name":"Office Supplies","value":1000.0,"category":"Office"},{"name":"Professional Fees","value":2500.0,"category":"Professional Services"}],"total":35000.0},"netProfit":15000.0},"metadata":{"uploadDate":"2025-05-05T11:38:12","source":"Excel Upload","currency":"USD"}}'
```

**Example Response:**
```json
{
  "company_name": "Test Company Ltd",
  "period": "For the month ended May 31, 2025",
  "financial_data": {
    "companyName": "Test Company Ltd",
    "period": "For the month ended May 31, 2025",
    "basisType": "Accrual",
    "reportType": "Complete",
    "sections": {
      "tradingIncome": {
        "accounts": [
          {"name": "Sales", "value": 95000.0, "category": "Revenue"},
          {"name": "Service Revenue", "value": 10000.0, "category": "Revenue"},
          {"name": "Other Income", "value": 5000.0, "category": "Revenue"}
        ],
        "total": 110000.0
      },
      "costOfSales": {
        "accounts": [
          {"name": "Purchases", "value": 40000.0, "category": "COGS"},
          {"name": "Direct Labor", "value": 15000.0, "category": "COGS"},
          {"name": "Manufacturing Supplies", "value": 5000.0, "category": "COGS"}
        ],
        "total": 60000.0
      },
      "grossProfit": 50000.0,
      "operatingExpenses": {
        "accounts": [
          {"name": "Rent", "value": 5000.0, "category": "Facilities"},
          {"name": "Utilities", "value": 2000.0, "category": "Utilities"},
          {"name": "Salaries and Wages", "value": 20000.0, "category": "Personnel"},
          {"name": "Insurance", "value": 1500.0, "category": "Insurance"},
          {"name": "Marketing", "value": 3000.0, "category": "Marketing"},
          {"name": "Office Supplies", "value": 1000.0, "category": "Office"},
          {"name": "Professional Fees", "value": 2500.0, "category": "Professional Services"}
        ],
        "total": 35000.0
      },
      "netProfit": 15000.0
    },
    "metadata": {
      "uploadDate": "2025-05-05T11:38:12",
      "source": "Excel Upload",
      "currency": "USD"
    },
    "metrics": {
      "gross_margin": 0.4545,
      "net_margin": 0.1364,
      "expense_ratio": 0.3182,
      "cogs_ratio": 0.5455,
      "revenue_breakdown": {
        "Sales": 0.8636,
        "Service Revenue": 0.0909,
        "Other Income": 0.0455
      },
      "expense_breakdown": {
        "Facilities": 0.1429,
        "Utilities": 0.0571,
        "Personnel": 0.5714,
        "Insurance": 0.0429,
        "Marketing": 0.0857,
        "Office": 0.0286,
        "Professional Services": 0.0714
      }
    }
  }
}
```

**Error Responses:**
- 422 Unprocessable Entity: If the request body is invalid
- 500 Internal Server Error: If there's an error calculating metrics

### Financial Insights

#### `POST /api/insights`

Generate AI-powered financial insights and recommendations using LLM.

**Request:**
- Content-Type: `application/json`
- Body: Object containing company name, period, and financial data with metrics (same format as the metrics response)

**Response:**
- Status: 200 OK
- Content-Type: `application/json`
- Body: Object containing insights, recommendations, and executive summary

#### `POST /api/chat`

Chat with the LLM about financial topics.

**Request:**
- Content-Type: `application/json`
- Body: Object containing the user's query

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/insights" \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Test Company Ltd","period":"For the month ended May 31, 2025","financial_data":{"companyName":"Test Company Ltd","period":"For the month ended May 31, 2025","basisType":"Accrual","reportType":"Complete","sections":{"tradingIncome":{"accounts":[{"name":"Sales","value":95000.0,"category":"Revenue"},{"name":"Service Revenue","value":10000.0,"category":"Revenue"},{"name":"Other Income","value":5000.0,"category":"Revenue"}],"total":110000.0},"costOfSales":{"accounts":[{"name":"Purchases","value":40000.0,"category":"COGS"},{"name":"Direct Labor","value":15000.0,"category":"COGS"},{"name":"Manufacturing Supplies","value":5000.0,"category":"COGS"}],"total":60000.0},"grossProfit":50000.0,"operatingExpenses":{"accounts":[{"name":"Rent","value":5000.0,"category":"Facilities"},{"name":"Utilities","value":2000.0,"category":"Utilities"},{"name":"Salaries and Wages","value":20000.0,"category":"Personnel"},{"name":"Insurance","value":1500.0,"category":"Insurance"},{"name":"Marketing","value":3000.0,"category":"Marketing"},{"name":"Office Supplies","value":1000.0,"category":"Office"},{"name":"Professional Fees","value":2500.0,"category":"Professional Services"}],"total":35000.0},"netProfit":15000.0},"metadata":{"uploadDate":"2025-05-05T11:38:12","source":"Excel Upload","currency":"USD"},"metrics":{"gross_margin":0.4545,"net_margin":0.1364,"expense_ratio":0.3182,"cogs_ratio":0.5455,"revenue_breakdown":{"Sales":0.8636,"Service Revenue":0.0909,"Other Income":0.0455},"expense_breakdown":{"Facilities":0.1429,"Utilities":0.0571,"Personnel":0.5714,"Insurance":0.0429,"Marketing":0.0857,"Office":0.0286,"Professional Services":0.0714}}}}'
```

**Example Response:**
```json
{
  "insights": [
    "Your gross profit margin of 45.45% is above the industry average of 40% for this sector.",
    "Personnel costs represent 57.14% of your total operating expenses, which is relatively high.",
    "Marketing expenses at 8.57% of operating costs may be too low for optimal growth."
  ],
  "recommendations": [
    "Consider evaluating your personnel structure to identify potential efficiencies.",
    "Increasing marketing spend by 3-5% could potentially boost revenue growth.",
    "Your cost of goods sold ratio is 54.55%, which suggests opportunities for negotiating better supplier terms."
  ],
  "executive_summary": "Test Company Ltd shows solid financial performance with above-average gross margins. Key areas for improvement include personnel cost optimization and increased marketing investment.",
  "generated_at": "2025-05-05T11:40:00"
}
```

#### Chat Endpoint Example

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"query":"What does our gross margin indicate about our pricing strategy?"}'
```

**Example Response:**
```json
{
  "response": "Your gross margin of 45.45% indicates a strong pricing strategy that allows for healthy profit after covering direct costs. This is above the industry average of 40%, suggesting you have good pricing power in your market. You could potentially explore premium pricing for certain products or services, or maintain current pricing while focusing on operational efficiencies to further improve this margin."
}
```

**Error Responses:**
- 422 Unprocessable Entity: If the request body is invalid
- 500 Internal Server Error: If there's an error generating a response

## Data Models

The API uses the following data models for requests and responses:

### Financial Data Model

```python
class FinancialData(BaseModel):
    companyName: str
    period: str
    basisType: str
    reportType: str
    sections: dict
    metadata: dict
```

### Metrics Response Model

```python
class MetricsResponse(BaseModel):
    company_name: str
    period: str
    financial_data: dict
```

### Insights Request Model

```python
class InsightsRequest(BaseModel):
    company_name: str
    period: str
    financial_data: dict
```

### Insights Response Model

```python
class InsightsResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    executive_summary: str
    generated_at: str
```

### Chat Request Model

```python
class ChatRequest(BaseModel):
    query: str
```

### Chat Response Model

```python
class ChatResponse(BaseModel):
    response: str
```
