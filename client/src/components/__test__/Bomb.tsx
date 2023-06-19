/**
 * Siehe https://github.com/bvaughn/react-error-boundary/blob/master/src/__tests__/index.tsx#L17
 */
export default function Bomb(): JSX.Element {
    throw new Error('💥 CABOOM 💥')
}