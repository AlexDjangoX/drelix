/**
 * Component test: Edit Product modal form wiring (useForm + zodResolver).
 * Ensures validation runs in the UI and blocks submit when required fields are empty.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditProductModal } from "@/components/admin/EditProductModal";

const mockUpdateProduct = vi.fn();
const mockUseQuery = vi.fn();

vi.mock("convex/react", () => ({
  useQuery: (query: unknown, args: unknown) => mockUseQuery(query, args),
  useMutation: () => mockUpdateProduct,
}));

vi.mock("@/context/language", () => ({
  useLanguage: () => ({ t: {} }),
}));

const mockRow: Record<string, string> = {
  Kod: "TEST-001",
  Nazwa: "Test product",
  ProductDescription: "",
  CenaNetto: "10.00",
  JednostkaMiary: "szt",
  StawkaVAT: "23",
  categorySlug: "first-aid",
  Heading: "",
  Subheading: "",
  Description: "",
};

describe("EditProductModal form wiring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockImplementation((_query: unknown, args: unknown) => {
      if (args === "skip") return undefined;
      if (typeof args === "object" && args !== null && "kod" in args)
        return mockRow;
      return [{ slug: "first-aid", titleKey: "x", displayName: "First aid" }];
    });
  });

  it("runs zod validation and blocks submit when Nazwa is empty", async () => {
    render(
      <EditProductModal
        row={mockRow}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const nazwaInput = screen.getByDisplayValue("Test product");
    expect(nazwaInput).toBeInTheDocument();

    fireEvent.change(nazwaInput, { target: { value: "" } });
    const zapiszButton = screen.getByRole("button", { name: /zapisz/i });
    fireEvent.click(zapiszButton);

    expect(mockUpdateProduct).not.toHaveBeenCalled();
    const errorMessage = await screen.findByText(/nazwa jest wymagana/i, {}, { timeout: 2000 });
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not show validation error before submit when Nazwa is filled", () => {
    render(
      <EditProductModal
        row={mockRow}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );
    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeInTheDocument();
    expect(screen.queryByText(/nazwa jest wymagana/i)).not.toBeInTheDocument();
  });
});
