fn main(private sigil: Field, public hash: Field) {
    constrain hash == sigil;
}
