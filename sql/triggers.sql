-- auto-insert prophecy_histories on new entropy_trails
CREATE OR REPLACE FUNCTION fn_insert_prophecy_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO prophecy_histories(trail_id, text)
    VALUES (NEW.id, NEW.note);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prophecy_history ON entropy_trails;
CREATE TRIGGER trg_prophecy_history
  AFTER INSERT ON entropy_trails
  FOR EACH ROW
  EXECUTE FUNCTION fn_insert_prophecy_history();
