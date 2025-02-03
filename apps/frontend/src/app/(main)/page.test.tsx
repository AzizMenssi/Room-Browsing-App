import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Home from "./page";

// Mock fetch globally
const mockFetchResponse = {
  data: [
    {
      _id: 1,
      name: "Deluxe Suite",
      type: "Suite",
      price: 150,
      currency: "USD",
      availability: true,
      description:
        "A spacious suite with a king-size bed, private balcony, and sea view.",
      features: {
        bedType: "King",
        maxOccupancy: 3,
        wifi: true,
        airConditioning: true,
        tv: true,
        minibar: true,
      },
      images: [
        "https://live.staticflickr.com/8324/8147794924_292179506c_b.jpg",
        "https://live.staticflickr.com/7028/13973728654_90846aedb0_z.jpg",
      ],
    },
    {
      _id: 2,
      name: "Cozy Single Room",
      type: "Single",
      price: 100,
      currency: "USD",
      availability: false,
      description: "A cozy single room perfect for solo travelers.",
      features: {
        bedType: "Single",
        maxOccupancy: 1,
        wifi: true,
        airConditioning: false,
        tv: true,
        minibar: false,
      },
      images: [
        "https://live.staticflickr.com/65535/49748784263_2ed8c5c07e_z.jpg",
        "https://live.staticflickr.com/7800/46437143934_4b5d68cfa1_z.jpg",
      ],
    },
    {
      _id: 3,
      name: "Luxury Suite",
      type: "Suite",
      price: 250,
      currency: "USD",
      availability: true,
      description: "A luxurious suite with amazing views.",
      features: {
        bedType: "Queen",
        maxOccupancy: 4,
        wifi: true,
        airConditioning: true,
        tv: true,
        minibar: true,
      },
      images: [
        "https://live.staticflickr.com/8582/16637853616_86f60537df_z.jpg",
        "https://live.staticflickr.com/7330/16893896440_7e4bc625b2_z.jpg",
      ],
    },
  ],
  totalPages: 5,
};

// Mock environment variable
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockFetchResponse),
  } as Response)
);

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component and fetches rooms", async () => {
    await act(async () => {
      render(<Home />);
    });

    // Check for main title
    expect(screen.getByText("Explore Our Rooms")).toBeInTheDocument();

    // Check for filter inputs
    expect(screen.getByLabelText("Room Type:")).toBeInTheDocument();
    expect(screen.getByLabelText("Min Price ($):")).toBeInTheDocument();
    expect(screen.getByLabelText("Max Price ($):")).toBeInTheDocument();
    expect(screen.getByLabelText("Search:")).toBeInTheDocument();

    // Wait for rooms to be loaded
    await waitFor(() => {
      expect(screen.getByText("Deluxe Suite")).toBeInTheDocument();
      expect(screen.getByText("Cozy Single Room")).toBeInTheDocument();
      expect(screen.getByText("Luxury Suite")).toBeInTheDocument();
    });
  });

  it("handles room type filtering", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<Home />);
    });

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Cozy Single Room")).toBeInTheDocument();
    });

    // Clear previous fetch calls
    (global.fetch as jest.Mock).mockClear();

    // Change room type to Suite
    await act(async () => {
      const select = screen.getByLabelText("Room Type:");
      await user.selectOptions(select, "Suite");
    });

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=1&limit=5&type=Suite&minPrice=&maxPrice=&search=`
    );
  });

  it("handles price filtering", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<Home />);
    });

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Cozy Single Room")).toBeInTheDocument();
    });

    // Clear previous fetch calls
    (global.fetch as jest.Mock).mockClear();

    // Enter min and max prices
    await act(async () => {
      const minPrice = screen.getByLabelText("Min Price ($):");
      const maxPrice = screen.getByLabelText("Max Price ($):");

      await user.type(minPrice, "150");
      await user.type(maxPrice, "300");
    });

    // Verify API calls
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=1&limit=5&type=&minPrice=150&maxPrice=300&search=`
      );
    });
  });

  it("handles search functionality", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<Home />);
    });

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Cozy Single Room")).toBeInTheDocument();
    });

    // Clear previous fetch calls
    (global.fetch as jest.Mock).mockClear();

    // Enter search query
    await act(async () => {
      const searchInput = screen.getByLabelText("Search:");
      await user.type(searchInput, "cozy");
    });

    // Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=1&limit=5&type=&minPrice=&maxPrice=&search=cozy`
      );
    });
  });

  it("handles pagination", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<Home />);
    });

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
    });

    // Clear previous fetch calls
    (global.fetch as jest.Mock).mockClear();

    // Click next button
    await act(async () => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);
    });

    // Verify page change
    await waitFor(() => {
      expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=2&limit=5&type=&minPrice=&maxPrice=&search=`
    );
  });

  it("handles filter reset", async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<Home />);
    });

    // Set some filters first
    await act(async () => {
      const searchInput = screen.getByLabelText("Search:");
      const minPrice = screen.getByLabelText(
        "Min Price ($):"
      ) as HTMLInputElement;
      const maxPrice = screen.getByLabelText(
        "Max Price ($):"
      ) as HTMLInputElement;
      const select = screen.getByLabelText("Room Type:") as HTMLSelectElement;

      await user.type(searchInput, "suite");
      await user.type(minPrice, "200");
      await user.type(maxPrice, "300");
      await user.selectOptions(select, "Suite");
    });

    // Clear previous fetch calls
    (global.fetch as jest.Mock).mockClear();

    // Click reset button
    await act(async () => {
      const resetButton = screen.getByRole("button", { name: "Reset Filters" });
      await user.click(resetButton);
    });

    // Get elements after reset
    const searchInput = screen.getByLabelText("Search:") as HTMLInputElement;
    const minPrice = screen.getByLabelText(
      "Min Price ($):"
    ) as HTMLInputElement;
    const maxPrice = screen.getByLabelText(
      "Max Price ($):"
    ) as HTMLInputElement;
    const select = screen.getByLabelText("Room Type:") as HTMLSelectElement;

    // Verify filters are reset
    expect(searchInput.value).toBe("");
    expect(minPrice.value).toBe("");
    expect(maxPrice.value).toBe("");
    expect(select.value).toBe("");

    // Verify API call with reset values
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rooms?page=1&limit=5&type=&minPrice=&maxPrice=&search=`
    );
  });
});
