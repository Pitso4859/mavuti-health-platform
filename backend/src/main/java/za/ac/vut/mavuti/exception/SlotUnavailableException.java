package za.ac.vut.mavuti.exception;

/** Thrown when a requested appointment slot is already booked. */
public class SlotUnavailableException extends RuntimeException {
    public SlotUnavailableException(String message) {
        super(message);
    }
}
