/**
 * Unit tests for SubcategoryManager.
 * Mocks only Convex (useQuery, useMutation) and toast as external APIs. Tests actual application logic.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SubcategoryManager } from "@/components/admin/SubcategoryManager";

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  createSubcategory: vi.fn(),
  deleteSubcategory: vi.fn(),
  seedGloves: vi.fn(),
  mutationIndex: 0,
  toastLoading: vi.fn(() => "toast-id"),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: (query: unknown, args: unknown) => mocks.useQuery(query, args),
  useMutation: () => {
    const idx = mocks.mutationIndex % 3;
    mocks.mutationIndex += 1;
    return [mocks.createSubcategory, mocks.deleteSubcategory, mocks.seedGloves][idx];
  },
}));

vi.mock("sonner", () => ({
  toast: {
    loading: (msg: string) => mocks.toastLoading(msg),
    success: (msg: string, opts?: { id?: string }) => mocks.toastSuccess(msg, opts),
    error: (msg: string, opts?: { id?: string }) => mocks.toastError(msg, opts),
  },
}));

describe("SubcategoryManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mutationIndex = 0;
    mocks.useQuery.mockImplementation((_q: unknown, args: unknown) => {
      if (args === "skip" || (typeof args === "object" && args !== null && !(args as { categorySlug?: string }).categorySlug))
        return undefined;
      return [];
    });
  });

  it("returns null when categorySlug is empty", () => {
    const { container } = render(
      <SubcategoryManager categorySlug="" />,
    );
    expect(container.firstChild).toBeNull();
    expect(mocks.useQuery).toHaveBeenCalledWith(expect.anything(), "skip");
  });

  it("renders manager with empty state and Brak when no subcategories", () => {
    mocks.useQuery.mockReturnValue([]);

    render(<SubcategoryManager categorySlug="gloves" />);

    expect(screen.getByTestId("subcategory-manager")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-empty")).toHaveTextContent("Brak");
    expect(screen.getByTestId("subcategory-manager-add-btn")).toBeInTheDocument();
  });

  it("shows seed button only for gloves category when empty and not disabled", () => {
    mocks.useQuery.mockReturnValue([]);

    const { unmount: unmountGloves } = render(<SubcategoryManager categorySlug="gloves" />);
    expect(screen.getByTestId("subcategory-manager-seed-gloves")).toBeInTheDocument();
    unmountGloves();

    render(<SubcategoryManager categorySlug="other" />);
    expect(screen.queryByTestId("subcategory-manager-seed-gloves")).not.toBeInTheDocument();
  });

  it("hides seed button when disabled", () => {
    mocks.useQuery.mockReturnValue([]);
    render(<SubcategoryManager categorySlug="gloves" disabled />);
    expect(screen.queryByTestId("subcategory-manager-seed-gloves")).not.toBeInTheDocument();
  });

  it("calls seedGloves and shows success when seed button clicked", async () => {
    mocks.useQuery.mockReturnValue([]);
    mocks.seedGloves.mockResolvedValue({ ok: true, created: 5 });

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-seed-gloves"));

    await waitFor(() => {
      expect(mocks.toastLoading).toHaveBeenCalledWith("Ładowanie podkategorii...");
    });
    await waitFor(() => {
      expect(mocks.seedGloves).toHaveBeenCalledWith({});
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Dodano 5 podkategorii", { id: "toast-id" });
  });

  it("renders list of subcategories with delete buttons when not disabled", () => {
    mocks.useQuery.mockReturnValue([
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
      { slug: "bawelniane", displayName: "Bawełniane", order: 2 },
    ]);

    render(<SubcategoryManager categorySlug="gloves" />);

    expect(screen.getByTestId("subcategory-manager-tag-gumowe")).toHaveTextContent("Gumowe");
    expect(screen.getByTestId("subcategory-manager-tag-bawelniane")).toHaveTextContent("Bawełniane");
    expect(screen.getByTestId("subcategory-manager-delete-gumowe")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-delete-bawelniane")).toBeInTheDocument();
  });

  it("does not render delete buttons when disabled", () => {
    mocks.useQuery.mockReturnValue([
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
    ]);

    render(<SubcategoryManager categorySlug="gloves" disabled />);

    expect(screen.getByTestId("subcategory-manager-tag-gumowe")).toBeInTheDocument();
    expect(screen.queryByTestId("subcategory-manager-delete-gumowe")).not.toBeInTheDocument();
  });

  it("calls deleteSubcategory and toast when delete clicked", async () => {
    mocks.useQuery.mockReturnValue([
      { slug: "gumowe", displayName: "Gumowe", order: 1 },
    ]);
    mocks.deleteSubcategory.mockResolvedValue(undefined);

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-delete-gumowe"));

    await waitFor(() => {
      expect(mocks.deleteSubcategory).toHaveBeenCalledWith({
        categorySlug: "gloves",
        slug: "gumowe",
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Podkategoria usunięta", { id: "toast-id" });
  });

  it("shows add form when Dodaj podkategorię clicked", () => {
    mocks.useQuery.mockReturnValue([]);

    render(<SubcategoryManager categorySlug="gloves" />);
    expect(screen.queryByTestId("subcategory-manager-add-form")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("subcategory-manager-add-btn"));

    expect(screen.getByTestId("subcategory-manager-add-form")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-input-display-name")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-submit")).toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-cancel")).toBeInTheDocument();
  });

  it("validates display name required and shows toast error when empty submit", async () => {
    mocks.useQuery.mockReturnValue([]);

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-add-btn"));
    fireEvent.click(screen.getByTestId("subcategory-manager-submit"));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        "Nazwa podkategorii jest wymagana",
        undefined,
      );
    });
    expect(mocks.createSubcategory).not.toHaveBeenCalled();
  });

  it("calls createSubcategory with categorySlug and displayName only (slug auto-generated by backend)", async () => {
    mocks.useQuery.mockReturnValue([]);
    mocks.createSubcategory.mockResolvedValue({ ok: true });

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-add-btn"));

    const displayInput = screen.getByTestId("subcategory-manager-input-display-name");
    fireEvent.change(displayInput, { target: { value: "Gumowe" } });
    fireEvent.click(screen.getByTestId("subcategory-manager-submit"));

    await waitFor(() => {
      expect(mocks.toastLoading).toHaveBeenCalledWith("Dodawanie podkategorii...");
    });
    await waitFor(() => {
      expect(mocks.createSubcategory).toHaveBeenCalledWith({
        categorySlug: "gloves",
        displayName: "Gumowe",
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Podkategoria dodana", { id: "toast-id" });
  });

  it("cancel button hides form and clears inputs", async () => {
    mocks.useQuery.mockReturnValue([]);

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-add-btn"));
    fireEvent.change(screen.getByTestId("subcategory-manager-input-display-name"), {
      target: { value: "X" },
    });
    fireEvent.click(screen.getByTestId("subcategory-manager-cancel"));

    expect(screen.queryByTestId("subcategory-manager-add-form")).not.toBeInTheDocument();
    expect(screen.getByTestId("subcategory-manager-add-btn")).toBeInTheDocument();
  });

  it("shows toast error when createSubcategory throws", async () => {
    mocks.useQuery.mockReturnValue([]);
    mocks.createSubcategory.mockRejectedValue(new Error("Subcategory already exists"));

    render(<SubcategoryManager categorySlug="gloves" />);
    fireEvent.click(screen.getByTestId("subcategory-manager-add-btn"));
    fireEvent.change(screen.getByTestId("subcategory-manager-input-display-name"), {
      target: { value: "Gumowe" },
    });
    fireEvent.click(screen.getByTestId("subcategory-manager-submit"));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith("Subcategory already exists", expect.anything());
    });
  });
});
