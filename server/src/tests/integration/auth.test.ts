import request from "supertest";
import app from "../../app";

describe("Auth Middleware Test", () => {
    const agent = request.agent(app);

    // it('should register successfully', async () => {
    //     const res = await agent
    //         .post("/api/auth/register")
    //         .send({
    //             name: "Test User",
    //             email: "user@gmail.com",
    //             password: "password123",
    //         });

    //     expect(res.status).toBe(201);
    //     expect(res.body.message).toBe("User created successfully");
    // });

    it('should not register with existing email', async () => {
        const res = await agent
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "user@gmail.com",
                password: "password123",
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    it("should login successfully", async () => {
        const res = await agent
            .post("/api/auth/login")
            .send({
                email: "user@gmail.com",
                password: "password123",
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it("should get user profile", async () => {
        const res = await agent.get("/api/auth/me");
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
    });

    it("should access protected route with cookie", async () => {
        const res = await agent.get("/api/test");

        expect(res.status).toBe(200);
    });

    it("should logout successfully", async () => {
        const res = await agent.post("/api/auth/logout");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should block unauthenticated request after logout", async () => {
        const res = await agent.get("/api/test");
        expect(res.status).toBe(401);
    });
});