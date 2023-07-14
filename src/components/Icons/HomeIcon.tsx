import { type Icon } from "~/types/Icon";

export default function HomeIcon({
  dimensions = 36,
  fill = "#757575",
  ...props
}: Icon) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      height={dimensions}
      width={dimensions}
      fill={fill}
      {...props}
    >
      <path d="M 32 8 C 31.08875 8 30.178047 8.3091875 29.435547 8.9296875 L 8.8007812 26.171875 C 8.0357812 26.810875 7.7634844 27.925203 8.2714844 28.783203 C 8.9184844 29.875203 10.35025 30.088547 11.28125 29.310547 L 31.677734 12.269531 C 31.864734 12.113531 32.135266 12.113531 32.322266 12.269531 L 52.71875 29.3125 C 53.09275 29.6255 53.546047 29.777344 53.998047 29.777344 C 54.693047 29.777344 55.382672 29.416656 55.763672 28.722656 C 56.228672 27.874656 55.954891 26.803594 55.212891 26.183594 L 52 23.498047 L 52 15 C 52 13.895 51.105 13 50 13 L 48 13 C 46.895 13 46 13.895 46 15 L 46 18.484375 L 34.564453 8.9296875 C 33.821953 8.3091875 32.91125 8 32 8 z M 32 16 L 12 32.705078 L 12 47 C 12 49.761 14.239 52 17 52 L 47 52 C 49.761 52 52 49.761 52 47 L 52 32.705078 L 32 16 z M 28 32 L 36 32 C 37.105 32 38 32.895 38 34 L 38 48 L 26 48 L 26 34 C 26 32.895 26.895 32 28 32 z" />
    </svg>
  );
}
