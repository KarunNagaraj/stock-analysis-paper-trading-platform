import bcrypt from "bcrypt";
import {
    AuthenticatedUser,
    LoginInput,
    PublicUser,
    RegisterInput,
} from "./auth.types";
import {
    createUser,
    findUserByEmail,
    findUserById,
} from "./auth.repository";
import {
    validateLoginInput,
    validateRegisterInput,
} from "./auth.validation";

//mainly used to convert a User object to a PublicUser object, ensuring we don't accidentally send password_hash to the frontend.
function toPublicUser(user: {
    id: number;
    email: string;
    created_at: Date;
    updated_at: Date;
}): PublicUser {
    return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

export async function registerUser(
    input: RegisterInput
): Promise<PublicUser> {
    validateRegisterInput(input);

    const existingUser = await findUserByEmail(input.email);

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12); //12 is the bcrpt cost factor, a higher value implies more computational work

    const userId = await createUser(
        input.email,
        passwordHash
    ); //create user returns the id of the newly created user in the database.

    const user = await findUserById(userId);

    if (!user) {
        throw new Error("Failed to retrieve created user");
    }

    return toPublicUser(user); //ensures we don't accidentally send password_hash to the frontend.
}

export async function authenticateUser(
    input: LoginInput
): Promise<AuthenticatedUser> {
    validateLoginInput(input);

    const user = await findUserByEmail(input.email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
        input.password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }

    return {
        id: user.id,
        email: user.email,
    };
}

export async function getUserById(
    id: number
): Promise<PublicUser | null> {
    const user = await findUserById(id);

    if (!user) {
        return null;
    }

    return toPublicUser(user);
}
/* There are two important bcrypt operations we'll use:

bcrypt.hash()

for registration, and:

bcrypt.compare()

for login.

POST /api/auth/register
          │
          ▼
     Controller
          │
          ▼
     registerUser()
          │
          ├── validate input
          │
          ├── findUserByEmail()
          │
          ├── if exists → error
          │
          ├── bcrypt.hash(password)
          │
          ├── createUser(email, hash)
          │
          ├── findUserById(id)
          │
          ├── toPublicUser()
          │
          ▼
     PublicUser
      
      
      authenticateUser()
      │
      ├── Validate input
      │
      ├── Find user by email
      │
      ├── Compare password with hash
      │
      └── Return authenticated identity*/