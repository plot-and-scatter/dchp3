import { parseWithZod } from "@conform-to/zod"
import {
  ChangeRoleSchema,
  CreateUserSchema,
  NO_ROLE,
  ReissuePasswordLinkSchema,
  UpdateUserNameSchema,
} from "./user.schemas"

// The same schema runs in the browser through conform and on the server in the
// action, so these go through parseWithZod rather than calling zod directly.

const submit = (entries: Record<string, string>) => {
  const data = new FormData()
  Object.entries(entries).forEach(([k, v]) => data.append(k, v))
  return parseWithZod(data, { schema: CreateUserSchema })
}

const valid = {
  email: "New.Person@Example.COM",
  firstName: "New",
  lastName: "Person",
  role: "Student / Editor",
}

describe("CreateUserSchema", () => {
  it("accepts a complete submission", () => {
    expect(submit(valid).status).toBe("success")
  })

  it("lower-cases the address", () => {
    // The directory joins Auth0 to the local table on a lower-cased address,
    // so one stored with capitals sits on the wrong side of that join.
    const submission = submit(valid)
    expect(submission.status === "success" && submission.value.email).toBe(
      "new.person@example.com"
    )
  })

  it("trims surrounding space from the name and the address", () => {
    const submission = submit({
      ...valid,
      email: "  a@b.co  ",
      firstName: " A ",
    })
    expect(submission.status === "success" && submission.value.email).toBe(
      "a@b.co"
    )
    expect(submission.status === "success" && submission.value.firstName).toBe(
      "A"
    )
  })

  it.each([
    ["a missing address", { ...valid, email: "" }],
    ["something that is not an address", { ...valid, email: "not-an-address" }],
    ["a missing first name", { ...valid, firstName: "" }],
    ["a missing last name", { ...valid, lastName: "" }],
    ["a role the tenant does not have", { ...valid, role: "Admin" }],
  ])("rejects %s", (_label, entries) => {
    expect(submit(entries).status).not.toBe("success")
  })

  it("rejects a field nobody asked for", () => {
    expect(submit({ ...valid, isAdmin: "true" }).status).not.toBe("success")
  })

  describe("creating someone with no role", () => {
    it("is refused unless the warning has been acknowledged", () => {
      const submission = submit({ ...valid, role: NO_ROLE })
      expect(submission.status).not.toBe("success")
    })

    it("is allowed once it has", () => {
      const submission = submit({
        ...valid,
        role: NO_ROLE,
        acknowledgeNoRole: "on",
      })
      expect(submission.status).toBe("success")
    })

    it("does not require the acknowledgement for a real role", () => {
      expect(submit(valid).status).toBe("success")
    })
  })
})

describe("UpdateUserNameSchema", () => {
  const submitName = (entries: Record<string, string>) => {
    const data = new FormData()
    Object.entries(entries).forEach(([k, v]) => data.append(k, v))
    return parseWithZod(data, { schema: UpdateUserNameSchema })
  }

  it("accepts what the form actually posts", () => {
    // Including the intent field, which says which of the page's two forms
    // was submitted. Leaving it out of a strict schema rejected every save.
    expect(
      submitName({ intent: "name", firstName: "New", lastName: "Name" }).status
    ).toBe("success")
  })

  it("still rejects a field nobody asked for", () => {
    expect(
      submitName({
        intent: "name",
        firstName: "New",
        lastName: "Name",
        isAdmin: "true",
      }).status
    ).not.toBe("success")
  })

  it.each([
    ["no first name", { intent: "name", firstName: "", lastName: "Name" }],
    ["no last name", { intent: "name", firstName: "New", lastName: "" }],
  ])("rejects %s", (_label, entries) => {
    expect(submitName(entries).status).not.toBe("success")
  })
})

describe("ReissuePasswordLinkSchema", () => {
  const submitLink = (entries: Record<string, string>) => {
    const data = new FormData()
    Object.entries(entries).forEach(([k, v]) => data.append(k, v))
    return parseWithZod(data, { schema: ReissuePasswordLinkSchema })
  }

  it("accepts what the form actually posts", () => {
    // Including the intent field. The same omission silently refused every
    // name save, so it is asserted here too.
    expect(
      submitLink({ intent: "password", auth0UserId: "auth0|1" }).status
    ).toBe("success")
  })

  it("rejects a submission with no account id", () => {
    expect(submitLink({ intent: "password" }).status).not.toBe("success")
  })
})

describe("ChangeRoleSchema", () => {
  const submitRole = (entries: Record<string, string>) => {
    const data = new FormData()
    Object.entries(entries).forEach(([k, v]) => data.append(k, v))
    return parseWithZod(data, { schema: ChangeRoleSchema })
  }

  it("accepts what the form actually posts", () => {
    expect(submitRole({ intent: "role", role: "Superadmin" }).status).toBe(
      "success"
    )
  })

  it("accepts setting no role", () => {
    expect(submitRole({ intent: "role", role: NO_ROLE }).status).toBe("success")
  })

  it("rejects a role the tenant does not have", () => {
    expect(submitRole({ intent: "role", role: "Admin" }).status).not.toBe(
      "success"
    )
  })
})
