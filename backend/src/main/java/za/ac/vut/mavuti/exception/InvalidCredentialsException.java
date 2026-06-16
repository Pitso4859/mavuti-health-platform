package za.ac.vut.mavuti.exception;

/** Thrown when login credentials (institution number / password) do not match a record. */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
