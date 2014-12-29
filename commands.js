/*
 * Command: PIO Access Read
 * Description: This command reads the PIO logical status and reports it together with the
 *   state of the PIO Output Latch in an endless loop. A PIO Access Read can be terminated at
 *   any time with a 1-Wire Reset. The state of both PIO channels is sampled at the same time.
 *   The first sampling occurs during the last (most significant) bit of the command code F5h.
 *   The PIO status is then reported to the bus master. While the master receives the last
 *   (most significant) bit of the PIO status byte, the next sampling occurs and so on until
 *   the master generates a 1-Wire Reset. The sampling occurs with a delay of tREH+x from the
 *   rising edge of the MS bit of the previous byte, as shown in Figure 7. The value of "x" is
 *   approximately 0.2µs.
 */

exports.PIO_ACCESS_READ = 0xF5;



/*
 * Command: PIO Access Write
 * Description: The PIO Access Write command writes to the PIO output latches, which control
 *   the pulldown transistors of the PIO channels. In an endless loop this command first writes
 *   new data to the PIO and then reads back the PIO status. This implicit read-after-write can
 *   be used by the master for status verification. A PIO Access Write can be terminated at any
 *   time with a 1-Wire Reset. After the command code the master transmits a PIO Output Data
 *   byte that determines the new state of the PIO output transistors. The first (least
 *   significant) bit is associated to PIOA; the next bit affects PIOB. The other 6 bits of the
 *   new state byte do not have corresponding PIO pins. These bits should always be transmitted
 *   as "1"s. To switch the output transistor on, the corresponding bit value is 0. To switch
 *   the output transistor off (non-conducting) the bit must be 1. This way the bit transmitted
 *   as the new PIO output state arrives in its true form at the PIO pin. To protect the
 *   transmission against data errors, the master must repeat the PIO Output Data byte in its
 *   inverted form. Only if the transmission was error-free will the PIO status change. The
 *   actual PIO transition to the new state occurs with a delay of tREH+x from the rising edge
 *   of the MS bit of the inverted PIO byte, as shown in Figure 8. The value of "x" is
 *   approximately 0.2µs. To inform the master about the successful communication of the PIO
 *   byte, the DS2413 transmits a confirmation byte with the data pattern AAh. While the MS bit
 *   of the confirmation byte is transmitted, the DS2413 samples the state of the PIO pins, as
 *   shown in Figure 7, and sends it to the master. The master can either continue writing more
 *   data to the PIO or issue a 1-Wire Reset to end the command.
 */

exports.PIO_ACCESS_WRITE = 0x5A;
