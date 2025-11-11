/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // ====== Palette mirip desain screenshot ======
        brand: {
          /* teal gelap untuk background utama */
          900: "#4F7F74",
          800: "#45736A",
          700: "#3D6A61",
        },
        surface: {
          /* krem lembut untuk kartu/field */
          DEFAULT: "#F1F5D8",
          100: "#EEF3D2",
          200: "#E6EEBD",
        },
        line: {
          /* warna garis/border lembut */
          200: "#CBD89A",
        },
        ink: {
          /* teks di atas surface */
          900: "#0F1B16",
          700: "#24453D",
        },
        accent: {
          /* aksen hijau kekuningan */
          500: "#B9D67A",
          600: "#A6C65E",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(2, 6, 23, 0.18)",
      },
    },
  },
};
